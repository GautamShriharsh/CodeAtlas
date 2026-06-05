import { db } from "@/server/db";
import { Octokit } from "@octokit/rest";

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
     throw new Error("Invalid github url")
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
  const project = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(project.githubUrl)
  const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)
  return unprocessedCommits;
};

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      githubUrl: true,
    },
  });
  if (!project?.githubUrl) {
    throw new Error('Project has not github url')
  }
  return project;
}


async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
    const processedCommits = await db.commit.findMany({
        where: { projectId }
    })
    //check if the anything from commitHashes exists in db and filter it out
    const unprocessedCommits = commitHashes.filter(commit => (
        !processedCommits.some(processed => (
            processed.commitHash === commit.commitHash
        ))
    ))

    return unprocessedCommits
}

await pollCommits('cmpxrha8f0000etswihftfxrm').then(console.log);

