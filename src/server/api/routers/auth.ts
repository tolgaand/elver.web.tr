import { TRPCError } from "@trpc/server";
import { z } from "zod";
import crypto from "crypto";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// Generate a random referral code
const generateReferralCode = () => {
  return "REF" + crypto.randomBytes(6).toString("hex").toUpperCase();
};

export const authRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        status: true,
        verified: true,
        createdAt: true,
        referralCode: true,
        invitationLimit: true,
        dailyPostLimit: true,
        dailyPostCount: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Kullanıcı profili bulunamadı",
      });
    }

    if (!user.referralCode) {
      const referralCode = generateReferralCode();

      await ctx.db.user.update({
        where: { id: userId },
        data: {
          referralCode,
          invitationLimit: user.invitationLimit || 5,
        },
      });

      return {
        ...user,
        referralCode,
      };
    }

    return user;
  }),

  getInvitationStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.db.user.findUnique({
      where: { id: userId },
      select: {
        referralCode: true,
        invitationLimit: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Kullanıcı bulunamadı",
      });
    }

    let referralCode = user.referralCode;
    if (!referralCode) {
      referralCode = generateReferralCode();
      await ctx.db.user.update({
        where: { id: userId },
        data: {
          referralCode,
          invitationLimit: user.invitationLimit || 5,
        },
      });
    }

    const referredCount = await ctx.db.user.count({
      where: { referredById: userId },
    });

    return {
      referralCode,
      invitationLimit: user.invitationLimit || 5,
      referredCount: referredCount,
      remainingInvites: (user.invitationLimit || 5) - referredCount,
    };
  }),

  validateInviteCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!input.code) {
        return { valid: false, reason: "EMPTY_CODE" };
      }

      if (!input.code.startsWith("REF")) {
        return { valid: false, reason: "INVALID_FORMAT" };
      }

      const inviter = await ctx.db.user.findUnique({
        where: { referralCode: input.code },
        select: {
          id: true,
          invitationLimit: true,
        },
      });

      if (!inviter) {
        return { valid: false, reason: "INVALID_CODE" };
      }

      const invitesSent = await ctx.db.user.count({
        where: { referredById: inviter.id },
      });

      if (invitesSent >= (inviter.invitationLimit ?? 5)) {
        return { valid: false, reason: "LIMIT_REACHED" };
      }

      return { valid: true };
    }),
});
