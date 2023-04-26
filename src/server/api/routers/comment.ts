import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      text: z.string(),
      cardId: z.string()
    }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.comment.create({
        data: {
          text: input.text,
          cardId: input.cardId,
          creator: ctx.session.user.id,
        }
      })
    }),
  
  getAll: protectedProcedure
    .input(z.object({ cardId: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.comment.findMany({
        where: {
          cardId: input.cardId,
        },
        include: {
          user: true,
        }
      })
    }),
})
