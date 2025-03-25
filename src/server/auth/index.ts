import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";
import type { NextRequest } from "next/server";

// NextAuth yapılandırması - req parametresini authConfig'e iletiyoruz
const {
  auth: uncachedAuth,
  handlers,
  signIn,
  signOut,
} = NextAuth((req?: NextRequest) => authConfig(req!));

// Performans için önbelleğe alıyoruz
const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
