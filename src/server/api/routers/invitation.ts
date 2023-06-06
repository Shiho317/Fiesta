import { z } from "zod";
import moment from "moment";
import Mustache from "mustache";
import axios from "axios";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { InvitationSchema } from "~/utils/schema";
import { generateJWT, getBaseUrl, verifyAndDecodeJWT } from "~/utils/server";

type TokenResponseProp = {
  name: string;
  email: string;
  eventId: string;
  invitedById: string;
};

export const invitationRouter = createTRPCRouter({
  getAllInvitationByEventPaginated: protectedProcedure
    .input(
      z.object({ eventId: z.string(), skip: z.number(), take: z.number() })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.invitation.findMany({
        skip: input.skip,
        take: input.take,
        where: {
          eventId: input.eventId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          attend: true,
          respondedAt: true,
        },
      });
    }),
  getTotalLengthByEventId: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.invitation.count({
        where: {
          eventId: input.eventId,
        },
      });
    }),
  createInvitation: protectedProcedure
    .input(InvitationSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        email,
        expiresAt,
        templateId,
        eventId,
        invitedById,
        sendAt,
        user,
      } = input;

      const invitationExists = await ctx.prisma.invitation.findFirst({
        where: {
          email,
          eventId,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (invitationExists) {
        throw new Error("You already sent valid invitation to this email.");
      }

      const expiredDate = moment(expiresAt);
      const currentDate = moment(new Date());

      const expiresIn = expiredDate.diff(currentDate, "days");

      const cardTemplate = await ctx.prisma.cardTemplate.findUnique({
        where: {
          id: templateId,
        },
      });

      if (!cardTemplate) {
        throw new Error("Oops.Something went wrong...");
      }

      const eventInfo = await ctx.prisma.event.findUnique({
        where: {
          id: eventId,
        },
        include: {
          venue: true,
        },
      });

      if (!eventInfo) {
        throw new Error("Oops.Something went wrong...");
      }

      const data = {
        name,
        email,
        eventId,
        invitedById,
      };

      const option = {
        expiresIn: `${expiresIn} days`,
      };

      const token = generateJWT(data, option);

      const splitDateAndTIme = moment(eventInfo?.eventDate)
        .format("MMM Do YYYY, h:mm a")
        .split(", ");

      const baseUrl = getBaseUrl() as string;

      const view = {
        eventName: eventInfo?.name,
        eventDate: splitDateAndTIme[0],
        eventTime: splitDateAndTIme[1],
        eventVenue: eventInfo.venue?.address,
        attend: `${baseUrl}/invitation/attend/${token}`,
        decline: `${baseUrl}/invitation/decline/${token}`,
        user: user.name,
      };

      const emailData = {
        to: email,
        from: user.email,
        subject: `[Invitation]: ${eventInfo.name}`,
        text: cardTemplate.text,
        html: Mustache.render(cardTemplate.html, view),
        sendAt: sendAt ? moment(sendAt).toDate() : new Date(),
      };

      const invitation = await ctx.prisma.invitation.create({
        data: {
          name,
          email,
          expiresAt: moment(expiresAt).toDate(),
          token,
          eventId,
          invitedById,
          sendAt: sendAt ? moment(sendAt).toDate() : new Date(),
        },
      });

      if (!invitation) {
        throw new Error("Failed to create invitation.");
      }
      //Send invitation email
      const res = await axios.post(
        process.env.AWS_ENDPOINT as string,
        emailData
      );
      if (res.status === 200) {
        console.log("Invitation has been sent.");
      } else {
        console.log("Failed to sent invitation.");
      }
    }),
  responseInvitation: publicProcedure
    .input(z.object({ token: z.string(), attend: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      //check token
      const tokenResult = verifyAndDecodeJWT(input.token) as TokenResponseProp;

      //search invitation
      const invitation = await ctx.prisma.invitation.findFirst({
        where: {
          token: input.token,
          email: tokenResult.email,
          name: tokenResult.name,
          invitedById: tokenResult.invitedById,
          eventId: tokenResult.eventId,
        },
      });

      //check invitation is valid and update
      const updateInvitation = await ctx.prisma.invitation.update({
        where: {
          id: invitation?.id,
        },
        data: {
          attend: input.attend,
          respondedAt: new Date(),
          updatedAt: new Date(),
          expiresAt: new Date(),
        },
      });

      if (!updateInvitation) {
        throw new Error("Failed to update your invitation response.");
      }

      //add guest to event
      return ctx.prisma.guest.create({
        data: {
          name: updateInvitation.name,
          email: updateInvitation.email,
          eventId: updateInvitation.eventId,
        },
        select: {
          name: true,
        },
      });
    }),
});
