import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const checklistRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      cardId: z.string()
    }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.checklist.create({
        data: {
          title: input.title,
          cardId: input.cardId,
        }
      })
    }),

  getAll: protectedProcedure
    .input(z.object({ cardId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.checklist.findMany({
        where: { cardId: input.cardId }
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      isDone: z.boolean().optional(),
    }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.checklist.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          isDone: input.isDone,
        }
      });
    }),
  
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.checklist.delete({
        where: { id: input.id }
      });
    })
})
