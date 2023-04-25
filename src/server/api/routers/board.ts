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

});
