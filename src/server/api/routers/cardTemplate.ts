import { createTRPCRouter, protectedProcedure } from "../trpc";

export const cardTemplateRouter = createTRPCRouter({
  getAllTemplates: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.cardTemplate.findMany();
  }),
});
