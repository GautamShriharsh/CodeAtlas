import { GoogleGenAI } from "@google/genai";
import type { Document } from "@langchain/core/documents";
import { Type } from "@google/genai";

export interface CommitItem {
  hash: string;
  message: string;
  diff: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const aiSummariseCommit = async (
  commits: CommitItem[],
): Promise<string[]> => {
  // Build the catalog containing up to 10 sliced diff blocks
  const commitCatalog = commits
    .map((commit) => {
      return `
      --- START COMMIT ID: ${commit.hash} ---
      Commit Message: ${commit.message}
      Diff Data:
      ${commit.diff.slice(0, 10000)}
      --- END COMMIT ID: ${commit.hash} ---`;
    })
    .join("\n\n");

  const prompt = `
          You are an expert software engineer reviewing a log of multiple structural git commits.

          Your task is to analyze the provided git commit blocks and write a concise summary of the changes introduced by EACH commit.

          Reminders about the git diff format:
          - For every file, there are metadata lines indicating which files were modified.
          - A line starting with '+' was added.
          - A line starting with '-' was removed.
          - Lines starting with neither are context lines and not part of the change itself.

          Guidelines for EACH individual commit summary string:
          - Produce a short list of a MAXIMUM of 2 to 3 markdown bullet points (using '*').
          - Focus on what changed and why it matters.
          - Prioritize behavior changes, new features, bug fixes, and architectural changes.
          - Group related file changes into a single bullet point whenever possible.
          - Include affected file names in square brackets when there are one or two clearly relevant files.
          - If more than two files are involved in a change, omit file names for readability.
          - Ignore email headers, subject lines, and timestamps at the top of the diff file.
          - Ignore formatting-only changes and lockfile noise (package-lock.json, yarn.lock, etc.).
          - Prefer describing outcomes over code mechanics.
          - Keep each bullet concise (ideally under 25 words).

          Example of text style expected inside each summary property:
          * Raised the amount of returned recordings from '10' to '100' [packages/server/recordings_api.ts]
          * Fixed a typo in the GitHub Action workflow name [.github/workflows/summarizer.yml]
          * Moved the 'octokit' initialization into a dedicated module [src/octokit.ts], [src/index.ts]

          Strict Output Format:
          You must strictly adhere to the requested JSON schema. Populate the 'summary' property for each commit hash with a single text string containing your 2-3 markdown bullet points. Do not provide introductory text, headings, or markdown code fences.
          `;

  //https://github.com/docker/genai-stack/commit/<commitHash>.diff
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [prompt, commitCatalog], // Pass the modified prompt + your diff data string
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summaries: {
            type: Type.ARRAY,
            description:
              "List of commit hashes mapped precisely to their structural summaries.",
            items: {
              type: Type.OBJECT,
              properties: {
                hash: { type: Type.STRING },
                summary: {
                  type: Type.STRING,
                  description:
                    "2-3 dense markdown bullet points utilizing bracketed file references.",
                },
              },
              required: ["hash", "summary"],
            },
          },
        },
        required: ["summaries"],
      },
    },
  });
  if (!response?.text) {
    throw new Error(
      "No response returned from Gemini commit batch summary processing.",
    );
  }

  const data = JSON.parse(response.text);

  const lookupMap = new Map<string, string>(
    data.summaries.map((item: { hash: string; summary: string }) => [
      item.hash,
      item.summary,
    ]),
  );

  // Return the array perfectly sorted to match your incoming input array index
  return commits.map(
    (commit) => lookupMap.get(commit.hash) || "* Summary generation skipped.",
  );
};

export const aiSummariseCode = async (docs: Document[]): Promise<string[]> => {
  console.log(`\nBatch summarising ${docs.length} files safely...`);

  // 1. Split your files into manageable chunks of 50 files each
  const chunkSize = 50;
  const chunks: Document[][] = [];
  for (let i = 0; i < docs.length; i += chunkSize) {
    chunks.push(docs.slice(i, i + chunkSize));
  }

  const allSummariesMap = new Map<string, string>();

  const prompt = `
               You are an expert technical documentation writer and software architect.
               Your task is to analyze multiple source code files and provide a concise,highly dense, functional summary optimized for vector database retrieval for EACH file.
                
                Guidelines:
                1. Focus on the core responsibility: Explain WHAT each file does and its architectural purpose.
                2. Highlight key components: Mention major functions, exported modules, API routes, or database schemas defined within it.
                3. Keep it concise: The summary MUST be under 100 words. Do not waste words on obvious implementation details (like "imports express").
                4. Strict Output Format: Return the results strictly matching the requested JSON schema. Do not wrap the output in markdown code blocks or provide any trailing text.
                `;

  // 2. Process each chunk sequentially
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]!;
    console.log(
      `⏳ Processing chunk ${i + 1} of ${chunks.length} (${chunk.length} files)...`,
    );

    const fileBlocks = chunk
      .map((doc) => {
        return `--- FILE: ${doc.metadata.source} ---\n${doc.pageContent}\n--- END FILE ---`;
      })
      .join("\n\n");

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite", 
      contents: [prompt, fileBlocks],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summaries: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  fileName: { type: Type.STRING },
                  summary: { type: Type.STRING },
                },
                required: ["fileName", "summary"],
              },
            },
          },
          required: ["summaries"],
        },
      },
    });

    if (response?.text) {
      const data = JSON.parse(response.text);
      data.summaries.forEach((s: { fileName: string; summary: string }) => {
        allSummariesMap.set(s.fileName, s.summary);
      });
    }

    // 2 second breathing room between chunks to clear the token rate limit
    if (i < chunks.length - 1) {
      console.log("Pausing for 2 seconds to respect API rate boundaries...");
      await sleep(2000);
    }
  }

  
  return docs.map((doc) => allSummariesMap.get(doc.metadata.source) || "");
};

//Generate vector embeddings for an entire array of summaries in a single request.
export async function generateBatchEmbeddings(
  summaries: string[],
): Promise<number[][]> {
  console.log(
    `\n⚡ Generating batch embeddings for ${summaries.length} summaries...`,
  );

  const response = await ai.models.embedContent({
    // 1. Use 001 for flat multi-string batching arrays
    model: "gemini-embedding-001",
    contents: summaries,
    config: {
      outputDimensionality: 768, // Forces the model to scale down to 768 dimensions
    },
  });

  // 2. Validate the backend plural array response packages
  if (!response.embeddings || response.embeddings.length === 0) {
    throw new Error(
      "Failed to generate batch embedding vectors: Empty API response",
    );
  }

  // 3. Drill down into each object array item to extract its raw values block
  return response.embeddings.map((item) => item.values! || []);
}
