import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

// Enum for contact methods
const ContactMethodEnum = z.enum(["phone", "email", "instagram", "telegram"]);

// Enum for timeout options (in minutes)
const TimeoutEnum = z.enum(["15", "30", "45", "60", "90"]);

export const needPostRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3).max(100),
        description: z.string().min(10).max(1000),
        contactMethod: ContactMethodEnum,
        contactDetail: z.string().optional(),
        locationLat: z.number().min(-90).max(90),
        locationLng: z.number().min(-180).max(180),
        locationName: z.string().optional(),
        timeout: TimeoutEnum,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.contactDetail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "İletişim bilgisi gereklidir",
        });
      }

      if (input.contactMethod === "phone") {
        if (!/^\+?[0-9]{10,15}$/.test(input.contactDetail)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Geçerli bir telefon numarası giriniz",
          });
        }
      } else if (input.contactMethod === "email") {
        try {
          z.string().email().parse(input.contactDetail);
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Geçerli bir e-posta adresi giriniz",
            cause: error,
          });
        }
      } else if (
        input.contactMethod === "instagram" ||
        input.contactMethod === "telegram"
      ) {
        if (!/^@?[a-zA-Z0-9_.]{1,30}$/.test(input.contactDetail)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Geçerli bir kullanıcı adı giriniz",
          });
        }

        if (
          !input.contactDetail.startsWith("@") &&
          input.contactDetail.length > 0
        ) {
          input.contactDetail = "@" + input.contactDetail;
        }
      }

      try {
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          select: {
            dailyPostLimit: true,
            dailyPostCount: true,
            lastPostCountReset: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Kullanıcı bulunamadı",
          });
        }

        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );

        let resetCount = false;
        if (
          !user.lastPostCountReset ||
          new Date(user.lastPostCountReset) < today
        ) {
          resetCount = true;
        }

        if (!resetCount && user.dailyPostCount >= user.dailyPostLimit) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Günlük ilan limitiniz (${user.dailyPostLimit}) doldu. Lütfen yarın tekrar deneyin.`,
          });
        }

        const defaultCategory = await ctx.db.category.findFirst({
          where: { slug: "others" },
        });

        if (!defaultCategory) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Default category not found",
          });
        }

        const needPost = await ctx.db.needPost.create({
          data: {
            title: input.title,
            description: input.description,
            contactMethod: input.contactMethod,
            contactDetail: input.contactDetail,
            locationLat: input.locationLat,
            locationLng: input.locationLng,
            locationName: input.locationName,

            expiresAt: new Date(
              Date.now() + parseInt(input.timeout) * 60 * 1000,
            ),

            isUrgent: false,
            isAnonymous: false,

            userId: ctx.session.user.id,
            categoryId: defaultCategory.id,
          },
        });

        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: {
            dailyPostCount: resetCount ? 1 : { increment: 1 },
            lastPostCountReset: today,
          },
        });

        return {
          success: true,
          needPost,
        };
      } catch (error) {
        console.error("Error creating need post:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "İhtiyaç ilanı oluşturulurken bir hata oluştu",
        });
      }
    }),

  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      const items = await ctx.db.needPost.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              surname: true,
              image: true,
            },
          },
          category: true,
          subCategory: true,
        },
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.needPost.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              surname: true,
              image: true,
            },
          },
          category: true,
          subCategory: true,
          tags: {
            include: {
              tag: true,
            },
          },
          helpOffers: {
            where: {
              userId: ctx.session?.user?.id ?? "",
            },
            take: 1,
          },
          _count: {
            select: {
              helpOffers: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "İhtiyaç ilanı bulunamadı",
        });
      }

      const userHasAccess =
        !post.isAnonymous ||
        (ctx.session?.user?.id !== undefined &&
          post.userId === ctx.session.user.id) ||
        post.helpOffers.length > 0;

      if (!userHasAccess) {
        post.contactMethod = null;
        post.contactDetail = null;
      }

      return post;
    }),

  getMyPosts: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.needPost.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        subCategory: true,
        _count: {
          select: {
            helpOffers: true,
          },
        },
      },
    });

    return posts;
  }),

  getActiveNeeds: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.needPost.findMany({
      where: {
        status: {
          in: ["PENDING", "INPROGRESS"],
        },
        isExpired: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        status: true,
        isUrgent: true,
        categoryId: true,
        category: true,
        locationLat: true,
        locationLng: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    return posts;
  }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "INPROGRESS", "COMPLETED", "CANCELED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;

      const post = await ctx.db.needPost.findFirst({
        where: {
          id,
          userId: ctx.session.user.id,
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "İhtiyaç ilanı bulunamadı veya bu işlem için yetkiniz yok",
        });
      }

      const updatedPost = await ctx.db.needPost.update({
        where: { id },
        data: { status },
      });

      if (status === "COMPLETED") {
        await ctx.db.helpOffer.updateMany({
          where: {
            needPostId: id,
            status: {
              in: ["PENDING", "INPROGRESS"],
            },
          },
          data: {
            status: "COMPLETED",
          },
        });
      }

      return updatedPost;
    }),
});
