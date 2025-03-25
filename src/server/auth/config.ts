import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import crypto from "crypto";
import { type NextRequest } from "next/server";
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
export const authConfig = (req: NextRequest) =>
  ({
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
      async signIn({ user }) {
        const cookieInviteCode = req.cookies.get("inviteCode");

        if (!user.email) {
          return false;
        }

        const existingUser = await db.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          return true;
        }

        if (user.email === "tolgababa21@gmail.com") {
          user.referralCode = generateReferralCode();
          user.invitationLimit = 999;
          return true;
        }

        if (!cookieInviteCode) {
          return `/auth/invite-required`;
        }

        const inviteCode = cookieInviteCode.value;

        const inviter = await db.user.findUnique({
          where: { referralCode: inviteCode },
        });

        if (!inviter) {
          return `/auth/invalid-invite`;
        }

        const invitesSent = await db.user.count({
          where: { referredById: inviter.id },
        });

        if (invitesSent >= (inviter.invitationLimit ?? 5)) {
          return `/auth/invite-limit-reached`;
        }

        user.referredById = inviter.id;
        user.referralCode = generateReferralCode();
        user.invitationLimit = 5;

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
      authorized({ auth, request }) {
        console.log({ auth, request });
        return true;
      },
    },

    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },

    debug: process.env.NODE_ENV === "development",
  }) satisfies NextAuthConfig;
