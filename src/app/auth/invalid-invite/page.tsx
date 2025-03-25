"use client";

import { useRouter } from "next/navigation";
import Header from "~/app/_components/header";
import Footer from "~/app/_components/footer";
import { Button } from "~/components/ui/button";

export default function InvalidInvitePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow">
            <div className="mb-6 text-center">
              <svg
                className="mx-auto h-16 w-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              <h1 className="mt-3 text-2xl font-bold text-gray-900">
                Geçersiz Davet Kodu
              </h1>
            </div>

            <p className="mb-4 text-center text-gray-600">
              Girdiğiniz davet kodu geçersiz veya süresi dolmuş. Lütfen doğru
              bir davet kodu temin edin.
            </p>

            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => router.push("/auth/signin")}
                className="w-full"
              >
                Giriş Sayfasına Dön
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
