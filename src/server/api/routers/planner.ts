import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const plannerRouter = createTRPCRouter({
  getByEmail: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.planner.findUnique({
        where: {
          email: input.email,
        },
      });
    }),
  getAllByUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.planner.findMany({
        where: {
          clientId: input.userId,
        },
      });
    }),
});
