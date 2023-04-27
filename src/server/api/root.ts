import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { boardRouter } from "./routers/board";
import { listRouter } from "./routers/list";
import { cardRouter } from "./routers/card";
import { commentRouter } from "./routers/comment";
import { checklistRouter } from "./routers/checklist";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  board: boardRouter,
  list: listRouter,
  card: cardRouter,
  comment: commentRouter,
  checklist: checklistRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
