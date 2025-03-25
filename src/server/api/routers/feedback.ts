import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const feedbackRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3, "Başlık en az 3 karakter olmalıdır."),
        content: z.string().min(10, "İçerik en az 10 karakter olmalıdır."),
        type: z.string().default("SUGGESTION"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const feedback = await ctx.db.feedback.create({
          data: {
            title: input.title,
            content: input.content,
            type: input.type,
            status: "PENDING",
            userId: ctx.session.user.id,
          },
        });

        return {
          success: true,
          message: "Geri bildiriminiz alındı, teşekkürler!",
          feedback,
        };
      } catch (error) {
        console.error("Error creating feedback:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Geri bildirim kaydedilirken bir hata oluştu",
        });
      }
    }),

  getMyFeedbacks: protectedProcedure.query(async ({ ctx }) => {
    try {
      const feedbacks = await ctx.db.feedback.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        success: true,
        feedbacks,
      };
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Geri bildirimler alınırken bir hata oluştu",
      });
    }
  }),
});
