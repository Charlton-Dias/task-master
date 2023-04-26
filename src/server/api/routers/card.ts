import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const cardRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      listId: z.string(),
    }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.card.create({
        data: {
          title: input.title,
          description: input.description,
          listId: input.listId,
        }
      })
    }),
})
