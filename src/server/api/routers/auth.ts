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

    // If the user doesn't have a referral code yet, generate one
    if (!user.referralCode) {
      const referralCode = generateReferralCode();

      await ctx.db.user.update({
        where: { id: userId },
        data: {
          referralCode,
          invitationLimit: user.invitationLimit || 5, // Ensure they have an invitation limit
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

    // Get user with invitation limit
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

    // If user doesn't have a referral code, generate one
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

    // Count number of users referred by this user
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

  // Validate invitation code
  validateInviteCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      // Skip validation for empty codes
      if (!input.code) {
        return { valid: false, reason: "EMPTY_CODE" };
      }

      // Validate code format - must start with REF
      if (!input.code.startsWith("REF")) {
        return { valid: false, reason: "INVALID_FORMAT" };
      }

      // Find the inviter by referral code
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

      // Check if the inviter has reached their limit
      const invitesSent = await ctx.db.user.count({
        where: { referredById: inviter.id },
      });

      if (invitesSent >= (inviter.invitationLimit ?? 5)) {
        return { valid: false, reason: "LIMIT_REACHED" };
      }

      return { valid: true };
    }),
});
