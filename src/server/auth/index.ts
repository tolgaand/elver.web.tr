import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";

// Basitleştirilmiş Auth yapılandırması
const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);

// Performans için önbelleğe alıyoruz
const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
