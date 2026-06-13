import { db } from "@/server/db";
import { Octokit } from "@octokit/rest";
import axios from "axios";
import { aiSummariseCommit } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type CommitResponse = {
  commitMessage: string;
  commitHash: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};



const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); //delay function to avoid hitting gemini api rate limits

export const getCommitHashes = async (
  githubUrl: string,
): Promise<CommitResponse[]> => {
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

  if (unprocessedCommits.length === 0) {
    console.log("All commits up to date. No execution needed.");
    return { count: 0 };
  }

  const commitsWithDiffs = await Promise.all(
    unprocessedCommits.map(async (commit) => {
       let diffText = "";
       try {
        const { data } = await axios.get(`${githubUrl}/commit/${commit.commitHash}.diff`, {
          headers: {
            Accept: "application/vnd.github.v3.diff",
          },
        });
        diffText = data;
      } catch (error) {
        console.error(`Error acquiring diff for commit context ${commit.commitHash}:`, error);
        diffText = "[Diff data could not be fetched from GitHub engine]"; // Fallback payload
      }
       return {
        hash: commit.commitHash,
        message: commit.commitMessage,
        diff: diffText,
      };
    })
  )
  const summaries = await aiSummariseCommit(commitsWithDiffs);


  const commitData = unprocessedCommits.map((commit, index) => ({
    projectId,
    commitHash: commit.commitHash,
    commitMessage: commit.commitMessage,
    commitAuthorName: commit.commitAuthorName,
    commitAuthorAvatar: commit.commitAuthorAvatar,
    commitDate: new Date(commit.commitDate),
    summary: summaries[index] || "* Summary generation skipped.",
  }));

  const commits = await db.commit.createMany({
    data: commitData,
  });
  return commits;
};

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
  commitHashes: CommitResponse[],
): Promise<CommitResponse[]> {
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

