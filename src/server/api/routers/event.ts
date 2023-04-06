import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import moment from "moment";

export const eventRouter = createTRPCRouter({
  getComingEventByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.event.findMany({
        where: {
          hostId: input.userId,
          eventDate: {
            gte: new Date(),
          },
        },
        select: {
          id: true,
          name: true,
          status: true,
          hostId: true,
          eventDate: true,
          guests: {
            select: {
              id: true,
            },
          },
          venue: {
            select: {
              name: true,
            },
          },
        },
      });
    }),
  getPastEventByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.event.findMany({
        where: {
          hostId: input.userId,
          eventDate: {
            lt: new Date(),
          },
        },
        select: {
          id: true,
          name: true,
          status: true,
          hostId: true,
          guests: true,
          eventDate: true,
          venue: {
            select: {
              name: true,
            },
          },
        },
      });
    }),
});
