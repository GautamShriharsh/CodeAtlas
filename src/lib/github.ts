import { db } from "@/server/db";
import { Octokit } from "@octokit/rest";
import axios from "axios";
import { aiSummariseCommit } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitMessage: string;
  commitHash: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); //delay function to avoid hitting gemini api rate limits

export const getCommitHashes = async (
  githubUrl: string,
): Promise<Response[]> => {
  const [owner, repo] = githubUrl.replace(/\/$/, "").split("/").slice(-2);

  if (!owner || !repo) {
    throw new Error("Invalid github url");
  }

  const { data } = await octokit.rest.repos.listCommits({
    owner: owner,
    repo: repo,
  });

  const sortedCommits = data.sort(
    (a, b) =>
      new Date(b.commit.author?.date ?? "").getTime() -
      new Date(a.commit.author?.date ?? "").getTime(),
  );

  return sortedCommits.slice(0, 10).map((commit) => ({
    commitHash: commit.sha,

    commitMessage: commit.commit.message ?? "",

    commitAuthorName: commit.commit.author?.name ?? "",

    commitAuthorAvatar: commit.author?.avatar_url ?? "",

    commitDate: commit.commit.author?.date ?? "",
  }));
};

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(project.githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );

  // 1. Create an array to hold our resolved summary responses
  const summaryResponses: string[] = [];

  // 2. Process them sequentially instead of in parallel
  for (const commit of unprocessedCommits) {
    try {
      const summary = await summariseCommit(githubUrl, commit.commitHash);
      summaryResponses.push(summary);
      
      //  Wait 1 second before hitting the API again
      // to ensure you stay well below the burst rate limit
     // await delay(1000); 
    } catch (error) {
      console.error(
        "Failed summary for commit:",
        commit.commitHash,
        error
      );
      summaryResponses.push(""); // Push empty string on failure so indexes still match
    }
  }

  const commitData = unprocessedCommits.map((commit, index) => ({
    projectId,
    commitHash: commit.commitHash,
    commitMessage: commit.commitMessage,
    commitAuthorName: commit.commitAuthorName,
    commitAuthorAvatar: commit.commitAuthorAvatar,
    commitDate: new Date(commit.commitDate),
    summary: summaryResponses[index] ?? "",
  }));

  const commits = await db.commit.createMany({
    data: commitData,
  });
  return commits;
};

async function summariseCommit(githubUrl: string, commitHash: string): Promise<string> {
  // get the diff and pass into ai
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });

  const truncatedDiffData = data.slice(0, 50000); //max 50k chars of diff data to summarise, can be adjusted based on token  limits and performance

  return (await aiSummariseCommit(truncatedDiffData)) || "";
}

async function fetchProjectGithubUrl(projectId: string): Promise<{ project: any; githubUrl: string }> {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      githubUrl: true,
    },
  });
  if (!project?.githubUrl) {
    throw new Error("Project has not github url");
  }
  return {
    project,
    githubUrl: project.githubUrl,
  };
}

async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: Response[],
): Promise<Response[]> {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
  });
  //check if the anything from commitHashes exists in db and filter it out
  const unprocessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processed) => processed.commitHash === commit.commitHash,
      ),
  );

  return unprocessedCommits;
}

// await pollCommits("cmpxrha8f0000etswihftfxrm").then(console.log);
