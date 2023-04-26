import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const listRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      boardId: z.string(),
      order: z.number(),
    }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.list.create({
        data: {
          title: input.title,
          boardId: input.boardId,
          order: input.order,
          userId: ctx.session.user.id,
        }
      })
    }),
  
  getAll: protectedProcedure
    .input(z.object({ boardId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.list.findMany({
        where: { boardId: input.boardId },
        orderBy: { order: "asc" },
        include: {
          cards: true
        }
      });
    }),


  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.list.delete({
        where: { id: input.id }
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      order: z.number().optional(),
    }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.list.update({
        where: { id: input.id },
        data: {
          title: input.title,
          order: input.order,
        }
      });
    }),

})
