/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { verifyAndDecodeJWT } from "~/utils/server";
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
  getByEmailAndPassword: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (!user) {
        return {
          statusCode: 500,
          data: {
            message: "User doesn't exist.",
            user: null,
          },
        };
      }
      const tokenDecoded = verifyAndDecodeJWT(user.password);
      if (tokenDecoded === input.password) {
        return {
          statusCode: 200,
          data: {
            message: "User found.",
            user,
          },
        };
      } else {
        return {
          statusCode: 501,
          data: {
            message: "User password is wrong.",
            user: null,
          },
        };
      }
    }),
});
