import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name: z.string(),
            githubUrl: z.string(),
            githubToken: z.string().optional()
        })
    ).mutation(async ({ctx, input}) => {
        
        const project = await ctx.db.project.create({
            data: {
                //data to create the project
                githubUrl: input.githubUrl,
                name: input.name,
                githubToken: input.githubToken,
                userToProjects: {
                    create: {
                        userId: ctx.user.userId!
                    }
                }
            }
        })
        return project;
    }),

    getProject: protectedProcedure.query(async ({ctx}) => {
       const projects = await ctx.db.project.findMany({
        where: {
            userToProjects: {
                some: {
                    userId: ctx.user.userId!
                }
            },
            deletedAt: null
        }
       })
       return projects;
    })
})

