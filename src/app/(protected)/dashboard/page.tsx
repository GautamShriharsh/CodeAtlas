"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";
import useProject from "@/hooks/use-projects";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import CommitLog from "./commit-log";
import AskQuestionCard from './ask-question-card';

function Dashboard() {
  const { user } = useUser();
  const { projects, project, projectId } = useProject();

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
          <div>TeamMembers</div>
          <div>InviteButton</div>
          <div>ArchiveButton</div>
        </div>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {/* <div className="rounded-lg border p-4">AskQuestionCard</div> */}
        <div className="md:col-span-3"><AskQuestionCard /></div>


        <div className="rounded-lg border p-4 md:col-span-2">MeetingCard</div>
      </div>

      {/* Commit Log Full Width */}
      {/* <div className="rounded-lg  p-4"><CommitLog /></div> */} 
      {/* paused for now */}
    </div>
  );
}

export default Dashboard;
