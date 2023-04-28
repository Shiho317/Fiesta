import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { VenueSchema } from "~/utils/schema";

export const defaultVenueData = {
  id: true,
  name: true,
  city: true,
  address: true,
};

export const venueRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.venue.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
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
  getVenuePaginated: protectedProcedure
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
        select: {
          event: {
            select: {
              id: true,
            },
          },
          ...defaultVenueData,
        },
      });
    }),
  upsertVenue: protectedProcedure
    .input(VenueSchema.merge(z.object({ venueId: z.string() })))
    .mutation(({ ctx, input }) => {
      const {
        name,
        country,
        state_province,
        city,
        address,
        zipcode,
        userId,
        venueId,
      } = input;
      return ctx.prisma.venue.upsert({
        where: {
          id: venueId ?? "",
        },
        create: {
          name,
          country,
          state_province,
          city,
          address,
          zipcode,
          registeredById: userId,
        },
        update: {
          name,
          country,
          state_province,
          city,
          address,
          zipcode,
          updatedAt: new Date(),
        },
      });
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.venue.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
