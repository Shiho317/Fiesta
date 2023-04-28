import { z } from "zod";
import Mustache from "mustache";
import axios from "axios";
import moment from "moment";

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
          guests: true,
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
          plannerId: z.string().optional(),
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
        plannerId,
        hostId,
        venueId,
        country,
        state_province,
        city,
        address,
        zipcode,
        eventId,
      } = input;

      let venue = "";

      //create venue of update
      if (venueName) {
        const eventVenue = await ctx.prisma.venue.upsert({
          where: {
            id: venueId ?? "",
          },
          create: {
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
          update: {
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
        if (!eventVenue) {
          throw new Error("Failed to save event place.");
        }
        venue = eventVenue.id;
      }

      let planner = "";

      if (plannerEmail) {
        const eventPlanner = await ctx.prisma.planner.upsert({
          where: {
            id: plannerId ?? "",
          },
          create: {
            name: plannerName as string,
            email: plannerEmail,
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
        planner = eventPlanner.id;
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
          ...(venue && {
            venue: {
              connect: {
                id: venue,
              },
            },
          }),
          ...(planner && {
            planner: {
              connect: {
                id: planner,
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
          ...(venue && {
            venue: {
              connect: {
                id: venue,
              },
            },
          }),
          ...(planner && {
            planner: {
              connect: {
                id: planner,
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
  cancelEvent: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        eventName: z.string(),
        eventDate: z.date(),
        email: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const cancelled = await ctx.prisma.event.update({
        where: {
          id: input.eventId,
        },
        data: {
          status: "CANCELED",
          canceled: true,
          updatedAt: new Date(),
        },
        include: {
          guests: true,
        },
      });

      if (!cancelled) {
        throw new Error("Failed to cancel event.");
      }

      const cancelTemplate = await ctx.prisma.emailTemplate.findFirst({
        where: {
          name: "cancel",
        },
      });

      if (!cancelTemplate) {
        throw new Error("Oops. Something went wrong...");
      }

      const view = {
        eventName: input.eventName,
        eventDate: moment(input.eventDate).format("MMM Do YYYY"),
        email: input.email,
        user: input.name,
      };

      //send bulk email
      for (const guest of cancelled.guests) {
        const emailData = {
          to: guest.email,
          from: input.email,
          subject: `[Cancelled]: ${input.eventName}`,
          text: cancelTemplate.text,
          html: Mustache.render(cancelTemplate.html, view),
          sendAt: new Date(),
        };
        //Send cancel email
        const res = await axios.post(
          process.env.AWS_ENDPOINT as string,
          emailData
        );
        if (res.status === 200) {
          console.log("Cancel email has been sent.");
        } else {
          console.log("Failed to sent cancel email.");
        }
      }
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
