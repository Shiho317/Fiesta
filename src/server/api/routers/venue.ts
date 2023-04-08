import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const venueRouter = createTRPCRouter({
  getAllByUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.venue.findMany({
        where: {
          registeredById: input.userId,
        },
      });
    }),
});
