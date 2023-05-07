/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import cloudinary from "cloudinary";

import { UserSchema } from "~/utils/schema";
import { generateJWT } from "~/utils/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { verifyAndDecodeJWT } from "~/utils/server";

type TokenResponseProp = {
  password: string;
};

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
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
        include: {
          image: true,
        },
      });
      if (!user) {
        throw new Error("User information does not exist.");
      }
      const decodedResult = verifyAndDecodeJWT(
        user?.password
      ) as TokenResponseProp;
      return {
        user,
        password: decodedResult.password,
      };
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
  updateUser: protectedProcedure
    .input(UserSchema.merge(z.object({ id: z.string() })))
    .mutation(({ ctx, input }) => {
      const encodedPassword = generateJWT({
        password: input.password,
      });
      return ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
          password: encodedPassword,
        },
      });
    }),
  updateImage: protectedProcedure
    .input(z.object({ id: z.string(), file: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currentImageId = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          image: {
            select: {
              publicId: true,
            },
          },
        },
      });

      const cloudinaryConfig = {
        upload_preset: process.env.CLOUD_PRESETS,
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      };

      cloudinary.v2.config(cloudinaryConfig);

      const image = await cloudinary.v2.uploader.upload(
        input.file,
        cloudinaryConfig,
        (error, result) => {
          if (error) {
            throw new Error(error.message);
          } else {
            console.log(result);
          }
        }
      );

      if (!image) {
        throw new Error("Could not update profile image.");
      }

      const updateImage = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          image: {
            upsert: {
              create: {
                publicId: image.public_id,
                format: image.format,
                signature: image.signature,
                url: image.secure_url,
              },
              update: {
                publicId: image.public_id,
                format: image.format,
                signature: image.signature,
                url: image.secure_url,
                updatedAt: new Date(),
              },
            },
          },
        },
      });

      if (!updateImage) {
        throw new Error("Could not update profile image.");
      }

      if (currentImageId?.image && currentImageId.image.publicId) {
        try {
          await cloudinary.v2.uploader.destroy(currentImageId.image.publicId, {
            invalidate: true,
          });
        } catch (error) {
          console.log({ error });
          throw new Error(error as string);
        }
      }

      return updateImage;
    }),
});
