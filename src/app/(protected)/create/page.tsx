"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import {toast} from 'sonner'
import useRefetch from "@/hooks/use-Refetch";

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

  const createProject = api.project.createProject.useMutation();

  const refetch = useRefetch()

  async function onSubmit(data: FormInput) {

    createProject.mutate({
      name: data.projectName,
      githubUrl: data.repoUrl,
      githubToken: data.githubToken
    },{
      onSuccess: () => {
        toast.success('Project created successfully')
        refetch()
      },
      onError: () => {
        toast.error('Failed to create project')
      }
    })
    reset();
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

          <Button
            type="submit"
            className="w-full bg-gray-500/15 hover:bg-gray-500/33 hover:cursor-pointer text-white"
            disabled={createProject.isPending}
          >
            {createProject.isPending ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;