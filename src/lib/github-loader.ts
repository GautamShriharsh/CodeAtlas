import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import {
  aiGenerateEmbeddings,
  aiSummariseCode,
  aiSummariseCommit,
} from "./gemini";
import { db } from "@/server/db";

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
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });
  console.log(" Fetching repository structure from GitHub...");

  const docs = await loader.load();

  return docs;
};

// console.log(await loadGithubRepo('https://github.com/GautamShriharsh/EchoFeed'));
await loadGithubRepo("https://github.com/GautamShriharsh/EchoFeed");

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl,githubToken);

    const allEmbeddings = await generateEmbeddings(docs);

    await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
        console.log(`processing ${index} of ${allEmbeddings.length}`)

        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data: {
                summary: embedding.summary,
                sourceCode: embedding.sourceCode,
                fileName: embedding.fileName,
                projectId,
            }
        })

        await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE id = ${sourceCodeEmbedding.id}`
    }))

    async function generateEmbeddings (docs: Document[])  {
    return await Promise.all(docs.map(async doc => {
        const summary = await aiSummariseCode(doc);
        const embedding = await aiGenerateEmbeddings(summary);
        return {
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)), // Ensure pageContent is a string
            fileName: doc.metadata.source,
        }
    }))
    }

}
