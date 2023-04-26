import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const boardRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
    }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.board.create({
        data: {
          title: input.title,
          description: input.description,
          creator: ctx.session.user.id,
        }
      })
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.board.findMany({
      where: {
        creator: ctx.session.user.id,
      }
    });
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.board.findUnique({
        where: {
          id: input.id,
        }
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.board.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
        }
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.board.delete({
        where: {
          id: input.id,
        }
      });
    }),

  addMember: protectedProcedure
    .input(z.object({
      id: z.string(),
      email: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email }
      });

      if (!user) {
        throw new Error("User not found");
      }

      return ctx.prisma.board.update({
        where: { id: input.id },
        data: {
          members: {
            push: user.id,
          }
        }
      });
    }),

});
