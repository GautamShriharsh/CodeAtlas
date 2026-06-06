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

  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit) =>
      summariseCommit(githubUrl, commit.commitHash),
    ),
  );

  const summaries = summaryResponses.map((response) => {
    if (response.status === "fulfilled") {
      return response.value as string;
    }
    return "";
  });

  const commitData = unprocessedCommits.map((commit, index) => ({
    projectId,
    commitHash: commit.commitHash,
    commitMessage: commit.commitMessage,
    commitAuthorName: commit.commitAuthorName,
    commitAuthorAvatar: commit.commitAuthorAvatar,
    commitDate: new Date(commit.commitDate),
    summary: summaries[index] ?? "",
  }));

  const commits = await db.commit.createMany({
    data: commitData,
  });
  return commits;
};

async function summariseCommit(githubUrl: string, commitHash: string) {
  // get the diff and pass into ai
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });

  return (await aiSummariseCommit(data)) || "";
}

async function fetchProjectGithubUrl(projectId: string) {
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
) {
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

await pollCommits("cmpxrha8f0000etswihftfxrm").then(console.log);
