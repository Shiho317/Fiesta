import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { eventRouter } from "./routers/event";
import { venueRouter } from "./routers/venue";
import { plannerRouter } from "./routers/planner";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  event: eventRouter,
  venue: venueRouter,
  planner: plannerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
