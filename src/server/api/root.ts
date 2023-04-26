import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { boardRouter } from "./routers/board";
import { listRouter } from "./routers/list";
import { cardRouter } from "./routers/card";

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
});

// export type definition of API
export type AppRouter = typeof appRouter;
