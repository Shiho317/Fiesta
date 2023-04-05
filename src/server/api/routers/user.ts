/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { UserSchema } from "~/utils/schema";
import { generateJWT } from "~/utils/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    return user;
  }),
  getByEmail: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
    }),
  createUser: publicProcedure
    .input(UserSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;
      const encodedPassword = generateJWT({
        password,
      });
      const newUser = await ctx.prisma.user.create({
        data: {
          name,
          email,
          password: encodedPassword,
        },
      });
      if (!newUser) {
        throw new TRPCError({
          message: "Failed to create new user.",
          code: "BAD_REQUEST",
        });
      }
      return newUser;
    }),
  verifiedById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const verifiedUser = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
      if (!verifiedUser) {
        throw new TRPCError({
          message: "Failed to verify user.",
          code: "BAD_REQUEST",
        });
      }
      return verifiedUser;
    }),
});
