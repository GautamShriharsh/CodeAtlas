"use server";
import { streamText } from "ai";
import { createStreamableValue } from "@ai-sdk/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";
import { CardDescription } from "@/components/ui/card";
import Stream from "stream";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue('');

  const queryVector = await generateEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;

  const result = (await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) as similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC 
    LIMIT 10
    `) as { fileName: string; sourceCode: string; summary: string }[];

  let context = "";

  for (const doc of result) {
    context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n `;
  }

  async () => {
    const stream = createStreamableValue('');

  try {
    // 2. Generate the single query vector
    const queryVector = await generateEmbedding(question);
    const vectorQuery = `[${queryVector.join(',')}]`;

    // 3. Search the vector space inside PostgreSQL using pgvector
    const result = (await db.$queryRaw`
      SELECT "fileName", "sourceCode", "summary",
      1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) as similarity
      FROM "SourceCodeEmbedding"
      WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.4
      AND "projectId" = ${projectId}
      ORDER BY similarity DESC 
      LIMIT 10
    `) as { fileName: string; sourceCode: string; summary: string }[];

    // 4. Build the context string by clipping the top matching files together
    let context = '';
    for (const doc of result) {
      context += `--- FILE: ${doc.fileName} ---\n`;
      context += `SUMMARY: ${doc.summary}\n`;
      context += `RAW CODE:\n${doc.sourceCode}\n`;
      context += `--- END FILE ---\n\n`;
    }

    // 5. Fire off the streaming generation in the background (Non-blocking)
    (async () => {
      try {
        const { textStream } = await streamText({
          model: google('gemini-3.1-flash-lite'), // Stable free-tier model asset
          prompt: `
                You are an AI code assistant who answers questions about the codebase. Your target audience is a technical intern who wants to understand the project structure and logic.
                AI assistant is a brand new, powerful, human-like artificial intelligence.
                The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
                AI is a well-behaved and well-mannered individual.
                AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
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

        // Loop through the token stream updates as they arrive from Google
        for await (const delta of textStream) {
          stream.update(delta);
        }
        
        // Finalize the transmission channel
        stream.done();
      } catch (streamError) {
        console.error("Error during text generation stream loop:", streamError);
        stream.error(streamError);
      }
    })();

    // 6. Instantly return the streaming value consumer handle to the client
    return {
        output: stream.value,
        filesReferences: result
    }

  } catch (error) {
    console.error("Failed to initialize askQuestion pipeline:", error);
    stream.done();
    throw error;
  }
}
}
