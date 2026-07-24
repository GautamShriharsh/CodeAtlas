import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { pollCommits } from "@/lib/github";
import { checkCredits, indexGithubRepo } from "@/lib/github-loader";
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
      const userCredits = await ctx.db.user.findUnique({
        where: {
          id: ctx.user.userId!
        },
        select: {
          credits: true
        }
      })
      if(!userCredits) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' })
      
      const fileCount = await checkCredits(input.githubUrl, input.githubToken);
      if(fileCount > userCredits.credits) throw new TRPCError({ code: 'FORBIDDEN', message: 'Insufficient credits' })



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
        await ctx.db.user.update({
          where: {
            id: ctx.user.userId!,
          },
          data: {
            credits: {
              decrement: fileCount,
            },
          },
        })
      } catch (error) {
        console.error("❌ CRASH INSIDE INDEXING WORKFLOW:", error);
        //  — delete project if error in indexing
        await ctx.db.project.delete({
          where: { id: project.id },
        }).catch((err) => console.error("Failed to cleanup project row:", err));;

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
      const commits = await ctx.db.commit.findMany({
        where: {
          projectId: input.projectId!,
        },
        orderBy: {
        createdAt: "desc", 
        },
      });
      return commits;
    }),

    syncCommits: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const result = await pollCommits(input.projectId);
        return result;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to sync repository commits",
          cause: error,
        });
      }
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

    getTeamMembers: protectedProcedure.input(
      z.object({
        projectId: z.string(),
      })
    ).query(async ({ctx, input}) => {
      return await ctx.db.userToProject.findMany({
        where: {
          projectId: input.projectId
        },
        include: {
          user: true
        }
      })
    }),

    getCredits: protectedProcedure.query(async ({ctx}) => {
      return await ctx.db.user.findUnique({
        where: {
          id: ctx.user.userId!
        },
        select: {
          credits: true
        }
      })
    }),

    checkCredits: protectedProcedure.input(
      z.object({
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      })
    ).mutation(async ({ctx, input}) => {
      const fileCount = await checkCredits(input.githubUrl, input.githubToken);
      const myCredits = await ctx.db.user.findUnique({
        where: {
          id: ctx.user.userId!
        },
        select: {
          credits: true
        }
      })
      return {
        fileCount,
        credits: myCredits?.credits ?? 0
      }
    })
});
