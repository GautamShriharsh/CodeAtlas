"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";
import useProject from "@/hooks/use-projects";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { ExternalLinkIcon, Loader2 } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import CommitLog from "./commit-log";
import AskQuestionCard from "./ask-question-card";
import ArchiveButton from "./archive-button";
import EmptyState from "./empty-state";
import InviteButton from "./invite-button";
import {
  PolygonLoader,
  FlippingCubeLoader,
} from "@/components/loaders/loaders";
import TeamMembers from "./team-members";

function Dashboard() {
  const { user } = useUser();
  const { projects, project, projectId, isLoading } = useProject();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 text-center">
        <FlippingCubeLoader />
        <p className="text-muted-foreground animate-pulse text-sm">
          Loading workspace data...
        </p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-muted-foreground">
          Please select a project from the sidebar to view insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Row */}
      <div className="flex items-start justify-between gap-4">
        {/* Github Link Card - Left */}
        <div className="w-fit rounded-md bg-cyan-500/10 px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan-500/20">
              <FiGithub className="h-4 w-4 text-cyan-400" />
            </div>

            <div className="flex items-center gap-1 text-sm">
              <span className="text-gray-400">This project is linked to</span>

              <Link
                href={project?.githubUrl ?? ""}
                target="_blank"
                className="flex items-center gap-1 text-cyan-400 underline"
              >
                {project?.githubUrl}
                <ExternalLinkIcon className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <div>
            <TeamMembers />
          </div>
          <div>
            <InviteButton />
          </div>
          <div>
            {" "}
            <ArchiveButton projectId={projectId} />
          </div>
        </div>
      </div>

    
      <div className="grid grid-cols-1 gap-4">
        
        <div className="w-full">
          <AskQuestionCard />
        </div>
      </div>

      {/* Commit Log */}
      <div className="rounded-lg  p-4"><CommitLog /></div>

    </div>
  );
}

export default Dashboard;
