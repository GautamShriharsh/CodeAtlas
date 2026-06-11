"use client";

import CommitLogSkeleton from "@/components/skeleton";
import useProject from "@/hooks/use-projects";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

const CommitLog = () => {
  const { projectId, project } = useProject();

  const { data: commits = [], isLoading } = api.project.getCommits.useQuery({
    projectId,
  });
 
  //loader while commits are loading
  if (isLoading) {
     return <CommitLogSkeleton/>
  }

  return (
    <>
      <ul className="space-y-6">
        {commits.map((commit, commitIdx) => {
          return (
            <li key={commit.id} className="flex gap-4">
              {/* Timeline */}
              <div className="relative flex flex-col items-center">
                {commitIdx !== commits.length - 1 && (
                  <div className="bg-border absolute top-10 h-[calc(100%+1.5rem)] w-px" />
                )}

                <img
                  src={commit.commitAuthorAvatar}
                  alt={commit.commitAuthorName}
                  className="border-background relative z-10 h-10 w-10 rounded-full border-2"
                />
              </div>

              {/* Commit Card */}
              <div className="bg-card flex-1 rounded-lg border p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-medium">
                    {commit.commitAuthorName}
                  </span>

                  <Link
                    target="_blank"
                    href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                  </Link>
                </div>

                <h3 className="mb-2 text-base font-semibold">
                  {commit.commitMessage}
                </h3>

                <pre className="text-muted-foreground text-sm whitespace-pre-wrap">
                  {commit.summary}
                </pre>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default CommitLog;
