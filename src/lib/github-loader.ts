import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import { minimatch } from "minimatch";
import {
  aiSummariseCode,
  aiSummariseCommit,
  generateBatchEmbeddings,
} from "./gemini";
import { db } from "@/server/db";
import { createId } from "@paralleldrive/cuid2";

const MAX_FILES = 150; //  limit for no of files

const IGNORE_PATTERNS = [
  // Lock files
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',

  // Config/meta files
  '**/*.json',
  '**/*.config.*',
  '**/*.mjs',
  '**/*.css',
  '.gitignore',

  // Folders to skip
  'public/**',
  'src/components/ui/**',
  'node_modules/**',
  '.git/**',
];

const shouldIgnore = (filePath: string): boolean => {
  return IGNORE_PATTERNS.some(pattern =>
    minimatch(filePath, pattern, { matchBase: true })
  );
};

// detects the branch for the repo
const getDefaultBranch = async (
  githubUrl: string,
  githubToken?: string
): Promise<string> => {
  // Extract owner/repo from URL
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) throw new Error(`Invalid GitHub URL: ${githubUrl}`);

  const [, owner, repo] = match;

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Authorization: `Bearer ${githubToken || process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch repo metadata: ${response.status}`);
  }

  const data = await response.json() as { default_branch: string };
  console.log(`🌿 Detected default branch: ${data.default_branch}`);
  return data.default_branch;
};

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
): Promise<Document[]> => {
  
  const branch = await getDefaultBranch(githubUrl, githubToken);

  
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || process.env.GITHUB_TOKEN,
    branch,
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
  const filtered = docs.filter(doc => !shouldIgnore(doc.metadata.source));

   console.log(`Downloaded ${filtered.length} files from GitHub.`);

  // Guard against massive repos
  if (filtered.length > MAX_FILES) {
    throw new Error(
      `Repository too large to index: ${filtered.length} files found. ` +
      `Maximum supported is ${MAX_FILES} files. ` +
      `Try a smaller or more focused repository.`
    );
  }

  return filtered;

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
