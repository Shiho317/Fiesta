import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { EventSchema, PlannerSchema, VenueSchema } from "~/utils/schema";

export const eventRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.event.findUnique({
        where: {
          id: input.id,
        },
        include: {
          venue: true,
          planner: true,
        },
      });
    }),
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
  createEvent: protectedProcedure
    .input(
      EventSchema.merge(
        z.object({
          venueId: z.string().optional(),
          venueName: z.string().optional().nullable(),
          country: z.string().optional().nullable(),
          state_province: z.string().optional().nullable(),
          city: z.string().optional().nullable(),
          address: z.string().optional().nullable(),
          zipcode: z.string().optional().nullable(),
          plannerId: z.string().optional(),
          plannerName: z.string().optional(),
          plannerEmail: z.string().optional(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        eventDate,
        venueName,
        plannerId,
        plannerName,
        plannerEmail,
        hostId,
        venueId,
        country,
        state_province,
        city,
        address,
        zipcode,
      } = input;

      let eventVenueId = null;
      //if new venue information exists, create venue
      if (!venueId && venueName) {
        const newVenue = await ctx.prisma.venue.create({
          data: {
            name: venueName,
            country: country as string,
            state_province: state_province as string,
            city: city as string,
            address: address as string,
            zipcode: zipcode as string,
            registeredBy: {
              connect: {
                id: hostId,
              },
            },
          },
        });
        if (!newVenue) {
          throw new Error("Failed to create new event.");
        }
        eventVenueId = newVenue.id;
      } else if (venueId) {
        //planner is already exists in DB
        eventVenueId = venueId;
      }

      let eventPlannerId = null;
      //if new planner information exists, create planner
      if (plannerName && plannerEmail) {
        const newPlanner = await ctx.prisma.planner.create({
          data: {
            name: plannerName,
            email: plannerEmail,
            client: {
              connect: {
                id: hostId,
              },
            },
          },
        });
        if (!newPlanner) {
          throw new Error("Failed to create new event.");
        }
        eventPlannerId = newPlanner.id;
      } else if (plannerId) {
        //planner is already exists in DB
        eventPlannerId = plannerId;
      }

      const newEvent = await ctx.prisma.event.create({
        data: {
          name,
          eventDate,
          host: {
            connect: {
              id: hostId,
            },
          },
          ...(eventVenueId && {
            venue: {
              connect: {
                id: eventVenueId,
              },
            },
          }),
          ...(eventPlannerId && {
            planner: {
              connect: {
                id: eventPlannerId,
              },
            },
          }),
        },
      });

      if (!newEvent) {
        throw new Error("Failed to create new event.");
      }

      return newEvent;
    }),
});
