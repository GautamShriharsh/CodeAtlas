import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { pollCommits } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          githubUrl: input.githubUrl,
          name: input.name,
          githubToken: input.githubToken,
          userToProjects: {
            create: {
              userId: ctx.user.userId!,
            },
          },
        },
      });
      try {
        await indexGithubRepo(project.id, input.githubUrl, input.githubToken);
        //await pollCommits(project.id); paused for now
      } catch (error) {
        //  — delete project if error in indexing
        await ctx.db.project.delete({
          where: { id: project.id },
        });

        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to index repository. Project creation rolled back.',
            cause: error
        })
      }

      return project;
    }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      where: {
        userToProjects: {
          some: {
            userId: ctx.user.userId!,
          },
        },
        deletedAt: null,
      },
    });
    return projects;
  }),

  getCommits: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // await pollCommits(input.projectId).then().catch(console.error) paused for sometime
      const commits = await ctx.db.commit.findMany({
        where: {
          projectId: input.projectId!,
        },
      });
      return commits;
    }),

  saveAnswer: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        question: z.string(),
        answer: z.string(),
        fileReferences: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.questions.create({
        data: {
          projectId: input.projectId,
          question: input.question,
          answer: input.answer,
          fileReferences: input.fileReferences,
          userId: ctx.user.userId!,
        },
      });
    }),

  getQuestions: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const questions = await ctx.db.questions.findMany({
        where: {
          projectId: input.projectId!,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return questions;
    }),

    archiveProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    ).mutation(async ({ ctx, input }) => {
      return await ctx.db.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }),
});
