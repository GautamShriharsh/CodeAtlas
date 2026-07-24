"use client";

import CommitLogSkeleton from "@/components/skeleton";
import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-projects";
import useRefetch from "@/hooks/use-Refetch";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLinkIcon, RefreshCw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const CommitLog = () => {
  const { projectId, project } = useProject();
  const refetch = useRefetch();

  const { data: commits = [], isLoading } = api.project.getCommits.useQuery({
    projectId,
  });
  const sortedCommits = [...commits].sort(
    (a, b) =>
      new Date(b.commitDate).getTime() - new Date(a.commitDate).getTime(),
  );
  const { mutate: syncCommits, isPending } =
    api.project.syncCommits.useMutation({
      onSuccess: async () => {
        toast.success("Commits synchronized successfully!");

        await refetch([["project", "getCommits"]]);
      },
      onError: () => {
        toast.error("Failed to sync commits. Check your GitHub tokens.");
      },
    });

  if (isLoading) {
    return <CommitLogSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="border-sidebar-border flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-md text-muted-foreground/90 font-bold tracking-tight">
            Commit Logs
          </h2>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="bg-background/40 border-sidebar-border text-sidebar-foreground flex items-center gap-2 text-xs font-medium hover:cursor-pointer"
          disabled={isPending}
          onClick={() => syncCommits({ projectId })}
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`}
          />
          {isPending ? "Syncing..." : "Sync Commits"}
        </Button>
      </div>

      {/* EMPTY STATE */}
      {sortedCommits.length === 0 && (
        <div className="bg-background/20 flex flex-col items-center justify-center rounded-lg py-12 text-center">
          <p className="text-muted-foreground text-sm font-medium">
            No commits indexed for this workspace yet.
          </p>
          <p className="text-muted-foreground/60 mt-1 max-w-sm px-4 text-xs">
            Click "Sync Commits" to analyze code push history.
          </p>
        </div>
      )}

      {/* TIMELINE */}
      {sortedCommits.length > 0 && (
        <ul className="space-y-6">
          {sortedCommits.map((commit, commitIdx) => {
            return (
              <li key={commit.id} className="flex gap-4">
                {/* Timeline Connector Graphic */}
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

                {/* Commit Content Frame Card */}
                <div className="bg-card flex-1 rounded-lg border p-4 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-medium">
                      {commit.commitAuthorName}
                    </span>

                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground/60 text-[11px] font-bold">
                        {new Date(commit.commitDate).toLocaleDateString()}
                      </span>
                      <Link
                        target="_blank"
                        href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                        className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
                      >
                        <ExternalLinkIcon className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>

                  <h3 className="text-sidebar-foreground mb-1.5 text-sm font-semibold">
                    {commit.commitMessage}
                  </h3>

                  <pre className="text-muted-foreground/80 bg-background/20 border-sidebar-border/40 rounded border p-2 font-sans text-sm leading-relaxed whitespace-pre-wrap">
                    {commit.summary}
                  </pre>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CommitLog;
