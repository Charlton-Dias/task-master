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

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.card.findUnique({
        where: {
          id: input.id,
        },
        include: {
          members: true,
        }
      });
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.card.delete({
        where: { id: input.id }
      })
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      due_date: z.string().optional(),
      listId: z.string().optional(),
    }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.card.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          due_date: input.due_date,
          listId: input.listId,
        }
      })
    }),

  addMember: protectedProcedure
    .input(z.object({
      id: z.string(),
      userId: z.string()
    }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.card.update({
        where: { id: input.id },
        data: {
          members: {
            connect: { id: input.userId }
          }
        }
      })
    })
})
