"use server";
import { streamText } from "ai";
import { createStreamableValue, type StreamableValue } from "@ai-sdk/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export interface AskQuestionResult {
  output: StreamableValue<string>;
  fileReferences: {
    fileName: string;
    sourceCode: string;
    summary: string;
  }[];
}

export async function askQuestion(  question: string, projectId: string
): Promise<AskQuestionResult> {
 
  const stream = createStreamableValue("");

  try {
    const queryVector = await generateEmbedding(question);
    const vectorQuery = `[${queryVector.join(",")}]`;

    const result = (await db.$queryRaw`
       SELECT "fileName", "sourceCode", "summary",
       1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) as similarity
       FROM "SourceCodeEmbedding"
       WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > .55
       AND "projectId" = ${projectId}
       ORDER BY similarity DESC 
       LIMIT 3
       `) as { fileName: string; sourceCode: string; summary: string }[];

    let context = "";

    for (const doc of result) {
      context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n `;
    }

    (async () => {
      try {
        const { textStream } = await streamText({
          model: google("gemini-3.1-flash-lite"), // Stable free-tier model asset

          prompt: `
                You are an AI code assistant who answers questions about the codebase. Your target audience is a technical intern who wants to understand the project structure and logic.
                AI assistant is a brand new, powerful, human-like artificial intelligence.
                The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.AI never greets the user.
                AI is eager to provide vivid and thoughtful responses to the user.
                AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in the codebase.
                If the question is asking about code or a specific file, AI will provide the detailed answer, giving step by step instructions.

                START CONTEXT BLOCK
                ${context}
                END OF CONTEXT BLOCK

                START QUESTION
                ${question}
                END OF QUESTION

                AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
                If the context does not provide the answer to the question, the AI assistant will say, "I'm sorry, but I don't know the answer based on the provided codebase context."
                AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
                AI assistant will not invent anything that is not drawn directly from the context.
                Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering.
                `,
        });

        for await (const delta of textStream) {
          stream.update(delta);
        }
        stream.done();
      } catch (streamError) {
        console.error("Stream loop error:", streamError);
        stream.error(streamError);
      }
    })();

    return {
      output: stream.value,
      fileReferences: result,
    };
  } catch (error) {
    console.error("Pipeline initialization error:", error);
    stream.done();
    throw error;
  }
}
