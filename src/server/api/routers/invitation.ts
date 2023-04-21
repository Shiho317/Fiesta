import { z } from "zod";
import moment from "moment";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { InvitationSchema } from "~/utils/schema";
import { generateJWT } from "~/utils/server";

export const invitationRouter = createTRPCRouter({
  getAllInvitationByEvent: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.invitation.findMany({
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
  createInvitation: protectedProcedure
    .input(InvitationSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        email,
        expiresAt,
        templateType,
        eventId,
        invitedById,
        sendAt,
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
        throw new Error("You already sent invitation to this email.");
      }

      const expiredDate = moment(expiresAt);
      const currentDate = moment(new Date());

      const expiresIn = expiredDate.diff(currentDate, "days");

      const data = {
        email,
        eventId,
        invitedById,
      };

      const option = {
        expiresIn: `${expiresIn} days`,
      };

      const token = generateJWT(data, option);

      return ctx.prisma.invitation.create({
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
      //TODO: Send invitation email
    }),
  // upsertInvitation: protectedProcedure
  //   .input(InvitationSchema.merge(z.object({
  //       invitationId: z.string().optional(),
  //     }))

  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const invitation = await ctx.prisma.invitation.upsert({
  //       where: {
  //         id: input.invitationId ?? "",
  //       },
  //       create: {
  //         name: input.name,
  //         email: input.email,
  //         expiresAt: moment(input.expiresAt).toDate(),
  //         token: "",
  //         eventId: "",
  //         invitedById: "",
  //       },
  //       update: {
  //         name: input.name,
  //         email: input.email,
  //         expiresAt: moment(input.expiresAt).toDate(),
  //         updatedAt: new Date(),
  //       },
  //     });
  //   }),
});
