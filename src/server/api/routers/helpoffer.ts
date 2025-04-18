import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const helpOfferRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        needPostId: z.string(),
        message: z.string().min(5).max(500),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { needPostId, message } = input;
      const userId = ctx.session.user.id;

      const needPost = await ctx.db.needPost.findUnique({
        where: { id: needPostId },
      });

      if (!needPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "İhtiyaç ilanı bulunamadı",
        });
      }

      const existingOffer = await ctx.db.helpOffer.findFirst({
        where: {
          needPostId,
          userId,
        },
      });

      if (existingOffer) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bu ilan için zaten bir yardım teklifiniz bulunmaktadır",
        });
      }

      const helpOffer = await ctx.db.helpOffer.create({
        data: {
          message,
          userId,
          needPostId,
        },
      });

      return {
        success: true,
        helpOffer,
      };
    }),

  getMyOffers: protectedProcedure.query(async ({ ctx }) => {
    const offers = await ctx.db.helpOffer.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        needPost: {
          include: {
            category: true,
          },
        },
      },
    });

    return offers;
  }),
});
