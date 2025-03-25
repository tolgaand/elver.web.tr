import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import crypto from "crypto";

import { db } from "~/server/db";

// Generate a random referral code
const generateReferralCode = () => {
  return "REF" + crypto.randomBytes(6).toString("hex").toUpperCase();
};

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      referralCode: string;
      invitationLimit: number;
      // ...other properties
    } & DefaultSession["user"];
  }

  interface User {
    referralCode?: string;
    invitationLimit?: number;
    referredById?: string | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(db),
  session: {
    strategy: "database",
  },
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      console.log("SIGN_IN_CALLBACK", user, account, profile);

      // Email is required
      if (!user.email) {
        return false;
      }

      // Check if user already exists (existing users can sign in)
      const existingUser = await db.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        // Existing user - allow sign in
        return true;
      }

      // Special admin email doesn't need invite code
      if (user.email === "tolgababa21@gmail.com") {
        // Store admin user without referrer
        user.referralCode = generateReferralCode();
        user.invitationLimit = 999; // Admin has high invite limit
        return true;
      }

      // New user - check for invite code
      let inviteCode = null;

      // Check credentials for invite code
      if (
        credentials &&
        typeof credentials === "object" &&
        "inviteCode" in credentials
      ) {
        inviteCode = credentials.inviteCode as string;
      }

      // Check query params (from URL) for invite code
      if (
        !inviteCode &&
        credentials?.query &&
        typeof credentials.query === "object"
      ) {
        const query = credentials.query as Record<string, unknown>;
        if ("inviteCode" in query && typeof query.inviteCode === "string") {
          inviteCode = query.inviteCode;
        }
      }

      // Check cookies for invite code
      if (
        !inviteCode &&
        credentials?.cookies &&
        typeof credentials.cookies === "object"
      ) {
        const cookies = credentials.cookies as Record<string, unknown>;
        if (
          "next-auth.invite-code" in cookies &&
          typeof cookies["next-auth.invite-code"] === "string"
        ) {
          inviteCode = cookies["next-auth.invite-code"];
        }
      }

      if (!inviteCode) {
        // No invite code provided for new user
        return `/auth/invite-required`;
      }

      // Verify invite code
      const inviter = await db.user.findUnique({
        where: { referralCode: inviteCode },
      });

      if (!inviter) {
        // Invalid invite code
        return `/auth/invalid-invite`;
      }

      // Check if inviter has reached their invitation limit
      const invitesSent = await db.user.count({
        where: { referredById: inviter.id },
      });

      if (invitesSent >= inviter.invitationLimit) {
        // Inviter has reached their limit
        return `/auth/invite-limit-reached`;
      }

      // Store the inviter ID and generate a new referral code
      user.referredById = inviter.id;
      user.referralCode = generateReferralCode();
      user.invitationLimit = 5; // Default invitation limit

      return true;
    },
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          referralCode: user.referralCode ?? "",
          invitationLimit: user.invitationLimit ?? 5,
        },
      };
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;
