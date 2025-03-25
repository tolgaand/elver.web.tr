"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import Header from "~/app/_components/header";
import Footer from "~/app/_components/footer";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow">
            <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
              Kimlik Doğrulama Hatası
            </h1>

            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error === "AccessDenied" && "Bu hesap ile giriş yapamazsınız."}
              {error === "Configuration" && "Sunucu yapılandırma hatası."}
              {error === "Verification" && "Doğrulama hatası."}
              {error === "Default" && "Giriş yapılırken bir hata oluştu."}
            </div>

            <div className="flex justify-center">
              <Link href="/auth/signin">
                <Button>Giriş Sayfasına Dön</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
