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
import { Octokit } from "@octokit/rest";

const MAX_FILES = 150; //  limit for no of files

const IGNORE_REGEXES = [
  /node_modules\//,          
  /\.git\//,
  /public\//,   
  /components\/ui\//,  
  /dist\//,     
  /\.next\//,      
  /build\//,
  /config\./,
  /\.json$/,
  /\.mjs$/,
  /\.gitignore$/,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /pnpm-lock\.yaml$/,
  /bun\.lockb$/,
  /README\.md$/i,
  /\.css$/,
  /\.scss$/,
  /api\/auth\/\[\.\.\.nextauth\]\/route\.ts$/,
  /\.(svg|png|jpg|jpeg|gif|ico|webp)$/,
  /\.env/,
  /\.lock$/,
  /\.(test|spec)\.(ts|tsx|js|jsx)$/,
  /\.md$/i,
  /^\.github\//,
  /^\.vscode\//,
  /\.d\.ts$/,
];

const IGNORE_PATTERNS = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "**/*.json",
  "**/*.config.*",
  "**/*.mjs",
  "**/*.css",
  ".gitignore",
  "**/public/**",
  "**/components/ui/**",
  "**/node_modules/**",
  "**/.git/**",
  "**/dist/**",
  "**/.next/**",
  "**/build/**"
];

const shouldIgnore = (filePath: string): boolean => {
  
  const matchesRegex = IGNORE_REGEXES.some((rx) => rx.test(filePath));
  if (matchesRegex) return true;

  return IGNORE_PATTERNS.some((pattern) =>
    minimatch(filePath, pattern, { matchBase: true }),
  );
};

// detects the branch for the repo
const getDefaultBranch = async (
  githubUrl: string,
  githubToken?: string,
): Promise<string> => {
  // Extract owner/repo from URL
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) throw new Error(`Invalid GitHub URL: ${githubUrl}`);

  const [, owner, repo] = match;

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        Authorization: `Bearer ${githubToken || process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch repo metadata: ${response.status}`);
  }

  const data = (await response.json()) as { default_branch: string };
  console.log(`Detected default branch: ${data.default_branch}`);
  return data.default_branch;
};
export const checkCredits = async (
  githubUrl: string,
  githubToken?: string,
): Promise<number> => {
  
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) {
    console.error(`Invalid GitHub URL: ${githubUrl}`);
    return 0;
  }
  const [, githubOwner, githubRepo] = match;

  const octokit = new Octokit({
    auth: githubToken || process.env.GITHUB_TOKEN,
  });

  try {
    
    const defaultBranch = await getDefaultBranch(githubUrl, githubToken);

    
    const { data } = await octokit.rest.git.getTree({
      owner: githubOwner!,
      repo: githubRepo!,
      tree_sha: defaultBranch,
      recursive: "true",
    });

    const validFiles = data.tree.filter((item) => {
      if (item.type !== "blob") return false;
      return !shouldIgnore(item.path ?? "");
    });

    return validFiles.length;

  } catch (error) {
    console.error("Failed to check repository credits:", error);
    return 0;
  }
};

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
): Promise<Document[]> => {
  const branch = await getDefaultBranch(githubUrl, githubToken);

  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || process.env.GITHUB_TOKEN,
    branch,
    ignoreFiles: IGNORE_REGEXES,
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });
  console.log(" Fetching repository structure from GitHub...");

  const docs = await loader.load();
  const filtered = docs.filter((doc) => !shouldIgnore(doc.metadata.source));

  console.log(`Downloaded ${filtered.length} files from GitHub.`);

  // Guard against massive repos
  if (filtered.length > MAX_FILES) {
    throw new Error(
      `Repository too large to index: ${filtered.length} files found. ` +
        `Maximum supported is ${MAX_FILES} files. ` +
        `Try a smaller or more focused repository.`,
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
  } catch (error: any) {
    console.error("❌ TRANSACTION DETAIL CRASH:");
  console.error(error); // 🚀 This will reveal the exact message (e.g., 'invalid vector syntax', 'dimension mismatch')
  if (error instanceof Error) {
    console.error("Message:", error.message);
  }
  throw error;
  }
}
