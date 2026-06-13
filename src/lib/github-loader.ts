import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import {
  aiSummariseCode,
  aiSummariseCommit,
  generateBatchEmbeddings,
} from "./gemini";
import { db } from "@/server/db";
import { createId } from "@paralleldrive/cuid2";

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
): Promise<Document[]> => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || process.env.GITHUB_TOKEN,
    branch: "master",
    ignoreFiles: [
      /^node_modules\//,
      /^\.git\//,
      /^public\//,
      /^src\/components\/ui\//,

      /config\./,

      /\.json$/,
      /\.mjs$/,
      /\.gitignore$/,

      /package-lock\.json$/,
      /yarn\.lock$/,
      /pnpm-lock\.yaml$/,
      /bun\.lockb$/,

      /README\.md$/i,
      // CSS / styling - no logic, useless for code analysis
      /\.css$/,
      /\.scss$/,

      // Auth/NextAuth route handlers - usually boilerplate wiring
      /api\/auth\/\[\.\.\.nextauth\]\/route\.ts$/,

      // Static asset extensions (in case any exist outside public/)
      /\.(svg|png|jpg|jpeg|gif|ico|webp)$/,

      // Lock/env example files
      /\.env/,
      /\.lock$/,

      // Test files - not useful for understanding app architecture
      /\.(test|spec)\.(ts|tsx|js|jsx)$/,

      // Markdown files generally (not just README)
      /\.md$/i,

      // CI/CD and misc config folders
      /^\.github\//,
      /^\.vscode\//,

      // Type-only declaration files - no logic, just types
      /\.d\.ts$/,
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });
  console.log(" Fetching repository structure from GitHub...");

  const docs = await loader.load();

  return docs;
};


export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);

  const summaries: string[] = await aiSummariseCode(docs);
  const embeddings: number[][] = await generateBatchEmbeddings(summaries);

  await saveRepositoryDataToDb(projectId, docs, summaries, embeddings);

};

export async function saveRepositoryDataToDb(
  projectId: string,
  docs: any[],
  summaries: string[],
  vectors: number[][],
) {
  console.log(
    `\n Bundling ${docs.length} database operations into a single transaction...`,
  );

    const insertionBatch = docs.map((doc, index) => {
    const id = createId();
    const fileName = doc.metadata.source;
    const sourceCode = doc.pageContent;
    const summary = summaries[index];
    const vectorString = JSON.stringify(vectors[index]);

    // Use your imported 'db' instance directly
    return db.$executeRaw`
        INSERT INTO "SourceCodeEmbedding" ("id", "sourceCode", "fileName", "summary", "projectId", "summaryEmbedding")
        VALUES (${id}, ${sourceCode}, ${fileName}, ${summary}, ${projectId}, ${vectorString}::vector)
      `;
  });

  try {
    // Run the atomic operation on your global instance
    await db.$transaction(insertionBatch);
    console.log("Complete repository indexed into PostgreSQL successfully!");
  } catch (error) {
    console.error("Transaction failed, rolling back alterations:", error);
    throw error;
  }
}
