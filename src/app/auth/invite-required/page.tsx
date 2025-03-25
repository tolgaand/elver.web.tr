"use client";

import { useRouter } from "next/navigation";
import Header from "~/app/_components/header";
import Footer from "~/app/_components/footer";
import { Button } from "~/components/ui/button";

export default function InviteRequiredPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow">
            <div className="mb-6 text-center">
              <svg
                className="mx-auto h-16 w-16 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              <h1 className="mt-3 text-2xl font-bold text-gray-900">
                Davet Kodu Gerekli
              </h1>
            </div>

            <p className="mb-4 text-center text-gray-600">
              Şu anda sadece davet kodu ile yeni kayıt yapılabilmektedir. Lütfen
              bir davet kodu temin edin veya bir arkadaşınızdan davet isteyin.
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
