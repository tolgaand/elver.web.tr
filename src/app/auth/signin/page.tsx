"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import Header from "~/app/_components/header";
import Footer from "~/app/_components/footer";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow">
            <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
              Giriş Yap
            </h1>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                {error === "AccessDenied" && "Bu hesap ile giriş yapamazsınız."}
                {error === "Configuration" && "Sunucu yapılandırma hatası."}
                {error === "Verification" && "Doğrulama hatası."}
                {error === "Default" && "Giriş yapılırken bir hata oluştu."}
              </div>
            )}

            <Button
              onClick={() => void signIn("google", { callbackUrl })}
              className="w-full"
            >
              Google ile Giriş Yap
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
