"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { toast } from 'sonner';
import useRefetch from "@/hooks/use-Refetch";
import useProject from "@/hooks/use-projects";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, Coins } from "lucide-react";

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
    formState: { isSubmitting },
  } = useForm<FormInput>();

  const router = useRouter();
  const createProject = api.project.createProject.useMutation();
  const checkCredits = api.project.checkCredits.useMutation();
  const { setProjectId } = useProject();
  const refetch = useRefetch();

  const hasEnoughCredits = checkCredits.data != null ? checkCredits.data?.fileCount <= checkCredits.data?.credits : true;

  async function onSubmit(data: FormInput) {
    if (checkCredits.data) {
      if (!hasEnoughCredits) {
        toast.error('Insufficient credits to index this repository');
        return;
      }

      createProject.mutate({
        name: data.projectName,
        githubUrl: data.repoUrl,
        githubToken: data.githubToken
      }, {
        onSuccess: (newProject) => {
          toast.success('Project created successfully');
          refetch();
          if (newProject?.id) {
            setProjectId(newProject.id);
          }
          router.push("/dashboard");
          reset();
        },
        onError: () => {
          toast.error('Failed to create project');
        }
      });
    } else {
      checkCredits.mutate({
        githubUrl: data.repoUrl,
        githubToken: data.githubToken
      });
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
      <div className="w-full max-w-lg rounded-xl bg-card p-8 shadow-sm">
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Link Your Repository
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Enter the url of your github repository to link to CodeAtlas.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Project Name
            </label>
            <Input
              placeholder="CodeAtlas"
              {...register("projectName", {
                required: true,
              })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Repository URL
            </label>
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
              <span className="ml-2 text-xs text-muted-foreground">
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
                <Alert className="bg-cyan-500/5 border-cyan-500/20">
                  <Coins className="h-4 w-4 text-cyan-400" />
                  <AlertTitle className="text-cyan-400 font-medium">Credit Verification</AlertTitle>
                  <AlertDescription className="text-xs text-muted-foreground mt-1.5 space-y-1">
                    <div className="flex justify-between">
                      <span>Files to Index (Required Credits):</span>
                      <span className="font-semibold text-foreground">{checkCredits.data.fileCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Available Balance:</span>
                      <span className="font-semibold text-emerald-400">{checkCredits.data.credits} tokens</span>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="font-semibold">Insufficient Balance</AlertTitle>
                  <AlertDescription className="text-xs mt-1.5 space-y-1 opacity-90">
                    <div className="flex justify-between">
                      <span>This repo requires:</span>
                      <span className="font-bold">{checkCredits.data.fileCount} credits</span>
                    </div>
                    <div className="flex justify-between">
                      <span>You currently have:</span>
                      <span className="font-bold">{checkCredits.data.credits} credits</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground pt-1 italic">
                      Please go to your Billing section to purchase additional indexing allocation credits.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gray-500/15 hover:bg-gray-500/33 hover:cursor-pointer text-white"
            disabled={createProject.isPending || checkCredits.isPending || (!hasEnoughCredits && !!checkCredits.data)}
          >
            {checkCredits.isPending ? "Analyzing Repository..." : (
              checkCredits.data ? (createProject.isPending ? "Creating..." : "Create Project") : "Check Credits"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;