import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

// Enum for contact methods
const ContactMethodEnum = z.enum(["phone", "email", "instagram", "telegram"]);

export const needPostRouter = createTRPCRouter({
  // Create a new need post
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if contact detail is provided when needed
      if (!input.contactDetail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "İletişim bilgisi gereklidir",
        });
      }

      // Validate the contact detail according to the method
      if (input.contactMethod === "phone") {
        // Simple phone validation - you might want to use a more sophisticated validation
        if (!/^\+?[0-9]{10,15}$/.test(input.contactDetail)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Geçerli bir telefon numarası giriniz",
          });
        }
      } else if (input.contactMethod === "email") {
        // Email validation using zod
        try {
          z.string().email().parse(input.contactDetail);
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Geçerli bir e-posta adresi giriniz",
          });
        }
      } else if (
        input.contactMethod === "instagram" ||
        input.contactMethod === "telegram"
      ) {
        // Basic username validation for social media
        if (!/^@?[a-zA-Z0-9_.]{1,30}$/.test(input.contactDetail)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Geçerli bir kullanıcı adı giriniz",
          });
        }

        // Add @ if not present
        if (
          !input.contactDetail.startsWith("@") &&
          input.contactDetail.length > 0
        ) {
          input.contactDetail = "@" + input.contactDetail;
        }
      }

      try {
        // Günlük ilan limitini kontrol et
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

        // Kullanıcının limiti reset edilmeli mi?
        let resetCount = false;
        if (
          !user.lastPostCountReset ||
          new Date(user.lastPostCountReset) < today
        ) {
          resetCount = true;
        }

        // Günlük limit kontrol
        if (!resetCount && user.dailyPostCount >= user.dailyPostLimit) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Günlük ilan limitiniz (${user.dailyPostLimit}) doldu. Lütfen yarın tekrar deneyin.`,
          });
        }

        // Get the "Diğer" category as default
        const defaultCategory = await ctx.db.category.findFirst({
          where: { slug: "others" },
        });

        if (!defaultCategory) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Default category not found",
          });
        }

        // Create the need post
        const needPost = await ctx.db.needPost.create({
          data: {
            title: input.title,
            description: input.description,
            contactMethod: input.contactMethod,
            contactDetail: input.contactDetail,
            locationLat: input.locationLat,
            locationLng: input.locationLng,
            locationName: input.locationName,
            // Default values
            isUrgent: false,
            isAnonymous: false,
            // Relations
            userId: ctx.session.user.id,
            categoryId: defaultCategory.id,
          },
        });

        // Kullanıcının günlük ilan sayacını güncelle
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

  // Get all need posts with pagination
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
              profileImage: true,
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

  // Get a specific need post by ID
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
              profileImage: true,
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

      // Check if user has access to this post
      const userHasAccess =
        // Public post
        !post.isAnonymous ||
        // User is the owner
        (ctx.session?.user?.id !== undefined &&
          post.userId === ctx.session.user.id) ||
        // User has an active offer on this post
        post.helpOffers.length > 0;

      // Remove contact details if user doesn't have access
      if (!userHasAccess) {
        post.contactMethod = null;
        post.contactDetail = null;
      }

      return post;
    }),

  // Get need posts created by the current user
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

  // Get all active needs (those with status PENDING or INPROGRESS)
  getActiveNeeds: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.needPost.findMany({
      where: {
        status: {
          in: ["PENDING", "INPROGRESS"],
        },
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
      },
    });

    return posts;
  }),

  // Update need post status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "INPROGRESS", "COMPLETED", "CANCELED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;

      // Check if the post exists and belongs to the user
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

      // Update the post status
      const updatedPost = await ctx.db.needPost.update({
        where: { id },
        data: { status },
      });

      // If completing the post, also complete all active help offers
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
