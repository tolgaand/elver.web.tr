"use client";

import { useSession } from "next-auth/react";
import { type ReactNode } from "react";

interface AuthConsumerProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthConsumer({
  children,
  requireAuth = false,
  redirectTo,
}: AuthConsumerProps) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary-500 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  if (requireAuth && status === "unauthenticated") {
    if (typeof window !== "undefined" && redirectTo) {
      window.location.href = redirectTo;
    }

    return null;
  }

  return <>{children}</>;
}
