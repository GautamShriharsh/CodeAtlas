"use client";

import useProject from "@/hooks/use-projects";
import { api } from "@/trpc/react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Mail, Calendar, Coins } from "lucide-react";

const TeamMembers = () => {
  const { projectId } = useProject();
  const { data: teamMembers, isLoading } = api.project.getTeamMembers.useQuery({
    projectId,
  });

  
  const [selectedMember, setSelectedMember] = useState<any>(null);

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  }

  return (
    <div className="flex items-center">
      {/* Avatar Facepile Stack */}
      <div className="flex -space-x-2 overflow-hidden">
        {teamMembers?.map((member) => {
          const fullName = `${member.user.firstName ?? ""} ${member.user.lastName ?? ""}`.trim() || "Collaborator";
          const fallbackInitial = member.user.emailAddress.charAt(0).toUpperCase();

          return (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)} // 🚀 Updates state with clicked member
              className="inline-block rounded-full ring-2 ring-background hover:scale-105 transition-transform hover:z-10 hover:cursor-pointer"
              title={fullName}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.user.imageUrl ?? undefined} alt={fullName} />
                <AvatarFallback className="bg-cyan-950 text-cyan-400 text-xs font-semibold">
                  {fallbackInitial}
                </AvatarFallback>
              </Avatar>
            </div>
          );
        })}
      </div>

      {/* Reusable Inspect Details Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader className="flex flex-col items-center border-b border-border/40 pb-4">
            <Avatar className="h-16 w-16 mb-2 ring-4 ring-cyan-500/10">
              <AvatarImage src={selectedMember?.user.imageUrl ?? undefined} />
              <AvatarFallback className="bg-cyan-950 text-cyan-400 text-xl font-semibold">
                {selectedMember?.user.emailAddress.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              {`${selectedMember?.user.firstName ?? ""} ${selectedMember?.user.lastName ?? ""}`.trim() || "Collaborator"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-mono">
              ID: {selectedMember?.user.id}
            </DialogDescription>
          </DialogHeader>

          {/* Details Grid */}
          <div className="space-y-3 py-2 text-sm">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Mail className="h-4 w-4 text-cyan-500/70 shrink-0" />
              <span className="text-foreground truncate">{selectedMember?.user.emailAddress}</span>
            </div>

            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Coins className="h-4 w-4 text-cyan-500/70 shrink-0" />
              <span>Available Compute Credits:</span>
              <span className="font-semibold text-foreground ml-auto bg-gray-500/10 px-2 py-0.5 rounded text-xs">
                {selectedMember?.user.credits ?? 0}
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Calendar className="h-4 w-4 text-cyan-500/70 shrink-0" />
              <span>Joined Project:</span>
              <span className="font-medium text-foreground ml-auto text-xs">
                {selectedMember?.createdAt ? new Date(selectedMember.createdAt).toLocaleDateString() : ""}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamMembers;