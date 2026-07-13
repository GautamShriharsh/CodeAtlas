"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-Refetch";
import useProject from "@/hooks/use-projects";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, Coins } from "lucide-react";
import { checkCredits } from './../../../lib/github-loader';

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<FormInput>();

  const router = useRouter();
  const createProject = api.project.createProject.useMutation();
  const checkCredits = api.project.checkCredits.useMutation();
  const { setProjectId } = useProject();
  const refetch = useRefetch();

  const [repoUrl, setRepoUrl] = useState<string|null>(null);
  const currentRepoUrl = watch("repoUrl");
  const isVerified = checkCredits.data && repoUrl === currentRepoUrl

  const hasEnoughCredits =
    checkCredits.data != null
      ? checkCredits.data?.fileCount <= checkCredits.data?.credits
      : true;

  async function onSubmit(data: FormInput) {
    if (isVerified) {
      if (!hasEnoughCredits) {
        toast.error("Insufficient credits to index this repository");
        return;
      }

      createProject.mutate(
        {
          name: data.projectName,
          githubUrl: data.repoUrl,
          githubToken: data.githubToken,
        },
        {
          onSuccess: async (newProject) => {
            toast.success("Project created successfully");
            await refetch();
            if (newProject?.id) {
              setProjectId(newProject.id);
            }
            reset();
            setRepoUrl(null);
            router.push("/dashboard");
          },
          onError: () => {
            toast.error("Failed to create project");
          },
        },
      );
    } else {
      checkCredits.mutate(
        {
          githubUrl: data.repoUrl,
          githubToken: data.githubToken,
        },
        {
          onSuccess: () => {
            setRepoUrl(data.repoUrl);
          },
        },
      );
    }
  }

  return (
    <div className="flex h-full items-center justify-center gap-16 px-8">
      {/* Illustration */}
      <div className="hidden lg:block">
        <img
          src="/analysis.svg"
          alt="GitHub Analysis"
          className="h-72 w-auto"
        />
      </div>

      {/* Form */}
      <div className="bg-card w-full max-w-lg rounded-xl p-8 shadow-sm">
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Link Your Repository
          </h1>

          <p className="text-muted-foreground mt-1 text-sm">
            Enter the url of your github repository to link to CodeAtlas.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Project Name</label>
            <Input
              placeholder="CodeAtlas"
              {...register("projectName", {
                required: true,
              })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Repository URL</label>
            <Input
              placeholder="https://github.com/username/repository"
              type="url"
              {...register("repoUrl", {
                required: true,
              })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              GitHub Access Token
              <span className="text-muted-foreground ml-2 text-xs">
                (optional)
              </span>
            </label>
            <Input
              type="password"
              placeholder="ghp_xxxxxxxx"
              {...register("githubToken")}
            />
          </div>

          {/* 🚀 Dynamic Credits Status Info Block */}
          {checkCredits.data && (
            <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-200">
              {hasEnoughCredits ? (
                <Alert className="border-cyan-500/20 bg-cyan-500/5">
                  <Coins className="h-4 w-4 text-cyan-400" />
                  <AlertTitle className="font-medium text-cyan-400">
                    Credit Verification
                  </AlertTitle>
                  <AlertDescription className="text-muted-foreground mt-1.5 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Files to Index (Required Credits):</span>
                      <span className="text-foreground font-semibold">
                        {checkCredits.data.fileCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Available Balance:</span>
                      <span className="font-semibold text-emerald-400">
                        {checkCredits.data.credits} tokens
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert
                  variant="destructive"
                  className="bg-destructive/5 border-destructive/20 text-destructive"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="font-semibold">
                    Insufficient Balance
                  </AlertTitle>
                  <AlertDescription className="mt-1.5 space-y-1 text-xs opacity-90">
                    <div className="flex justify-between">
                      <span>This repo requires:</span>
                      <span className="font-bold">
                        {checkCredits.data.fileCount} credits
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>You currently have:</span>
                      <span className="font-bold">
                        {checkCredits.data.credits} credits
                      </span>
                    </div>
                    <p className="text-muted-foreground pt-1 text-[11px] italic">
                      Please go to your Billing section to purchase additional
                      indexing allocation credits.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gray-500/15 text-white hover:cursor-pointer hover:bg-gray-500/33"
            disabled={
              createProject.isPending ||
              checkCredits.isPending ||
              (isVerified && !hasEnoughCredits) 
            }
          >
            {checkCredits.isPending ? 
                "Analyzing Repository..."
              : ( isVerified ? 
                  (createProject.isPending ? 
                    "Creating..."
                  : "Create Project" )
                : "Check Credits" )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
