import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PlannerSchema } from "~/utils/schema";

export const defaultPlannerData = {
  id: true,
  name: true,
  email: true,
  phone: true,
  organization: true,
};

export const plannerRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.planner.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getByEmail: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.planner.findUnique({
        where: {
          email: input.email,
        },
      });
    }),
  getAllByUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.planner.findMany({
        where: {
          clientId: input.userId,
        },
      });
    }),
  getPlannerPaginated: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.planner.findMany({
        where: {
          clientId: input.userId,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          events: {
            select: {
              id: true,
            },
          },
          ...defaultPlannerData,
        },
      });
    }),
  upsertPlanner: protectedProcedure
    .input(
      PlannerSchema.merge(
        z.object({ plannerId: z.string().optional().nullable() })
      )
    )
    .mutation(({ ctx, input }) => {
      const { name, email, phone, organization, plannerId, userId } = input;
      return ctx.prisma.planner.upsert({
        where: {
          id: plannerId ?? "",
        },
        create: {
          name,
          email,
          phone,
          organization,
          clientId: userId,
        },
        update: {
          name,
          phone,
          organization,
          updatedAt: new Date(),
        },
      });
    }),
});
