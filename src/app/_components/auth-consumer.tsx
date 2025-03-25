"use client";

import { useSession } from "next-auth/react";
import { type ReactNode } from "react";

interface AuthConsumerProps {
  children: ReactNode;
  requireAuth?: boolean; // Eğer true ise, oturum açılmamışsa içerik gizlenir
  redirectTo?: string; // Oturum açılmamışsa yönlendirilecek sayfa
}

/**
 * Kullanıcının oturum durumunu kontrol eden ve duruma göre uygun içeriği gösteren bileşen.
 * useSession loading durumundayken, spinner gösterilir.
 */
export default function AuthConsumer({
  children,
  requireAuth = false,
  redirectTo,
}: AuthConsumerProps) {
  const { status } = useSession();

  // Oturum durumu yüklenirken spinner göster
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary-500 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  // Eğer oturum açılması gerekiyorsa ve oturum açılmamışsa,
  // uygun sayfaya yönlendir (client-side redirect)
  if (requireAuth && status === "unauthenticated") {
    if (typeof window !== "undefined" && redirectTo) {
      window.location.href = redirectTo;
    }

    // Yönlendirme yapılırken içeriği gizle
    return null;
  }

  // Normal durumlarda içeriği göster
  return <>{children}</>;
}
