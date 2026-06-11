import { GoogleGenAI } from "@google/genai";
import type { Document } from "@langchain/core/documents";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


export const aiSummariseCommit = async (diff: string): Promise<string> => {
    
    const prompt = `
                    You are an expert software engineer reviewing a git diff.

                    Your task is to write a concise summary of the changes introduced by the commit.

                    Reminders about the git diff format:
                    - For every file, there are metadata lines indicating which files were modified.
                    - A line starting with '+' was added.
                    - A line starting with '-' was removed.
                    - Lines starting with neither are context lines and not part of the change itself.

                    Guidelines:
                    - Produce a short list of a MAXIMUM of 2 to 3 bullet points.
                    - Focus on what changed and why it matters.
                    - Prioritize behavior changes, new features, bug fixes, and architectural changes.
                    - Group related file changes into a single bullet point whenever possible.
                    - Include affected file names in square brackets when there are one or two clearly relevant files.
                    - If more than two files are involved in a change, omit file names for readability.
                    - Ignore email headers, subject lines, and timestamps at the top of the diff file.
                    - Ignore formatting-only changes and lockfile noise (package-lock.json, yarn.lock, etc.).
                    - Prefer describing outcomes over code mechanics.
                    - Keep each bullet concise (ideally under 25 words).
                    - Output ONLY the bullet list. No intro text, no headings, no explanations.

                    Example summaries:
                    * Raised the amount of returned recordings from '10' to '100' [packages/server/recordings_api.ts]
                    * Fixed a typo in the GitHub Action workflow name [.github/workflows/summarizer.yml]
                    * Moved the 'octokit' initialization into a dedicated module [src/octokit.ts], [src/index.ts]

                    Now summarize the following git diff: \n
                    ${diff}
                    `;
    
    //https://github.com/docker/genai-stack/commit/<commitHash>.diff
    const response = await ai.models.generateContent({
    model: "gemini-3.5-flash", // or gemini-1.5-flash
    contents: prompt,          // Swapped parameter name to 'contents'
    });   
    
     if (!response?.text) {
        throw new Error(`Error generating commit summary: No text response from model`);
    }
     return response.text ?? "";
}


export const aiSummariseCode = async (doc: Document): Promise<string> => {
    console.log("Summarising code for file: ", doc.metadata.source)

    const code = doc.pageContent.slice(0, 10000); //limit to first 10k characters to avoid overwhelming the model

    
    const prompt = `
                You are an expert technical documentation writer and software architect.
                Your task is to analyze the source code of a file and provide a highly dense, functional summary optimized for vector database retrieval.

                File Name: ${doc.metadata.source}

                Guidelines:
                1. Focus on the core responsibility: Explain WHAT this file does and its architectural purpose in the application.
                2. Highlight key components: Mention major functions, exported modules, API routes, or database schemas defined within it.
                3. Keep it concise: The summary MUST be under 100 words. Do not waste words on obvious implementation details (like "imports express").
                4. Strict Output Format: Output ONLY the plain text summary. Do not include introductory phrases (like "This file is..."), headings, or markdown formatting blocks.

                Source Code:
                """
                ${code}
                """
                `;
                    
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
    });

    if (!response?.text) {
        throw new Error(`No summary generated for file: ${doc.metadata.source}`);
    }
    
    return response.text ?? "";
}

export async function aiGenerateEmbeddings(summary: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: summary, // Pass raw string
    config: {
      outputDimensionality: 768, // Match your Prisma vector(768) requirement
    },
  });

  if (!response.embeddings || response.embeddings.length === 0) {
    throw new Error("Failed to generate embedding vector");
  }

  // 2. Drill directly into the first object to grab the raw array of numbers
  return response.embeddings[0]!.values || [];
}

console.log(await aiGenerateEmbeddings("hello there how is it doing what on earth??"));
