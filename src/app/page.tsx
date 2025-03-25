"use client";

import Header from "./_components/header";
import Footer from "./_components/footer";
import ActiveNeedsMap from "./_components/active-needs-map";
import { FaHandFist } from "react-icons/fa6";
import { FaMap } from "react-icons/fa";
import { useRouter } from "next/navigation";
import RecentNeedsTable from "./_components/recent-needs-table";
import { Button } from "~/components/ui/button";

export default function Home() {
  const router = useRouter();
  return (
    <main className="bg-accent-50 flex min-h-screen flex-col">
      <Header />

      <div className="flex-1">
        {/* Eylem Çağrısı - Modern Tasarım (Header'ın hemen altında) */}
        <section className="from-primary-800 via-primary-700 to-primary-900 relative bg-gradient-to-br py-24">
          <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
            <div className="bg-primary-500/20 absolute -top-24 -left-4 h-64 w-64 rounded-full blur-3xl"></div>
            <div className="bg-secondary-500/20 absolute -right-4 -bottom-24 h-64 w-64 rounded-full blur-3xl"></div>
            <div className="bg-primary-400/20 absolute top-1/4 left-1/3 h-32 w-32 rounded-full blur-2xl"></div>
          </div>

          <div className="relative container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <FaHandFist className="h-12 w-12 text-white" />
              </div>

              <h1 className="mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-5xl font-bold text-transparent">
                Elver: Topluluk Dayanışma Ağı
              </h1>

              <p className="mb-10 text-xl text-white/80">
                İhtiyaçlarınızı paylaşın, topluluk gücüyle çözüme ulaştırın.
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <Button
                  onClick={() => {
                    router.push("/ihtiyacim-var");
                  }}
                  className="text-primary-900 cursor-pointer bg-white px-8 py-4 text-base font-semibold hover:bg-white/90 md:text-lg"
                >
                  İhtiyaç Bildir
                </Button>

                {/* <ActionButton
                  label="Yardım Edebilirim"
                  onClick={() => {
                    router.push("/yardım-edebilirim");
                  }}
                  className="border border-white bg-transparent px-8 py-4 text-base font-semibold text-white hover:bg-white/10 md:text-lg"
                /> */}
              </div>
            </div>
          </div>
        </section>

        {/* Aktif İhtiyaç Haritası - Yeniden Tasarlanmış */}
        <section className="bg-gradient-to-r from-blue-50 via-white to-blue-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <FaMap className="h-7 w-7" />
              </div>
              <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
                Aktif İhtiyaç Haritası
              </h2>
              <div className="mb-4 h-1 w-24 rounded bg-blue-500"></div>
              <p className="max-w-2xl text-center text-lg text-gray-600">
                Türkiye genelinde aktif ihtiyaçların gerçek zamanlı haritası
              </p>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-lg">
              <ActiveNeedsMap />
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Harita her 10 saniyede bir otomatik olarak güncellenir</p>
            </div>
          </div>
        </section>

        {/* Modern Nasıl Çalışır ve Son Paylaşımlar Bölümleri */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-col items-center">
              <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
                Son Eklenen İhtiyaçlar
              </h2>
              <div className="mb-4 h-1 w-24 rounded bg-blue-500"></div>
              <p className="max-w-2xl text-center text-lg text-gray-600">
                Sistemdeki en güncel ihtiyaç ilanları
              </p>
            </div>

            <RecentNeedsTable />
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
