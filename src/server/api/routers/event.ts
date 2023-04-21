import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { EventSchema } from "~/utils/schema";

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
  getAllEventsByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.event.findMany({
        where: {
          hostId: input.userId,
          eventDate: {
            gte: new Date(),
          },
        },
        orderBy: {
          eventDate: "asc",
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
  upsertEvent: protectedProcedure
    .input(
      EventSchema.merge(
        z.object({
          eventId: z.string().optional(),
          venueId: z.string().optional(),
          venueName: z.string().optional().nullable(),
          country: z.string().optional().nullable(),
          state_province: z.string().optional().nullable(),
          city: z.string().optional().nullable(),
          address: z.string().optional().nullable(),
          zipcode: z.string().optional().nullable(),
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
        plannerName,
        plannerEmail,
        hostId,
        venueId,
        country,
        state_province,
        city,
        address,
        zipcode,
        eventId,
      } = input;

      //create venue of update
      const eventVenue = await ctx.prisma.venue.upsert({
        where: {
          id: venueId ?? "",
        },
        create: {
          name: venueName as string,
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
        update: {
          name: venueName as string,
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
      if (!eventVenue) {
        throw new Error("Failed to save event place.");
      }

      const eventPlanner = await ctx.prisma.planner.upsert({
        where: {
          email: plannerEmail ?? "",
        },
        create: {
          name: plannerName as string,
          email: plannerEmail as string,
          client: {
            connect: {
              id: hostId,
            },
          },
        },
        update: {
          client: {
            connect: {
              id: hostId,
            },
          },
          updatedAt: new Date(),
        },
      });

      if (!eventPlanner) {
        throw new Error("Failed to save planner.");
      }

      const event = await ctx.prisma.event.upsert({
        where: {
          id: eventId ?? "",
        },
        create: {
          name,
          eventDate,
          host: {
            connect: {
              id: hostId,
            },
          },
          ...(eventVenue.id && {
            venue: {
              connect: {
                id: eventVenue.id,
              },
            },
          }),
          ...(eventPlanner.id && {
            planner: {
              connect: {
                id: eventPlanner.id,
              },
            },
          }),
        },
        update: {
          name,
          eventDate,
          updatedAt: new Date(),
          host: {
            connect: {
              id: hostId,
            },
          },
          ...(eventVenue.id && {
            venue: {
              connect: {
                id: eventVenue.id,
              },
            },
          }),
          ...(eventPlanner.id && {
            planner: {
              connect: {
                id: eventPlanner.id,
              },
            },
          }),
        },
      });

      if (!event) {
        throw new Error("Failed to create new event.");
      }

      return event;
    }),
  deleteEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.event.delete({
        where: {
          id: input.eventId,
        },
      });
    }),
});
