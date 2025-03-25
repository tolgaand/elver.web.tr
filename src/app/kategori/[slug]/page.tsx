import { HydrateClient } from "~/trpc/server";
import Header from "../../_components/header";
import Footer from "../../_components/footer";
import Link from "next/link";
import { categories } from "../../_data/categories";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  // Slug'a göre kategoriyi bul
  const category = categories.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === slug,
  );

  if (!category) {
    return (
      <HydrateClient>
        <main className="bg-accent-50 flex min-h-screen flex-col">
          <Header />
          <div className="container mx-auto flex-1 px-4 py-8">
            <h1 className="text-primary-700 mb-6 text-3xl font-bold">
              Kategori Bulunamadı
            </h1>
            <p className="text-secondary-700">
              Aradığınız kategori bulunamadı.
            </p>
            <Link
              href="/"
              className="text-primary-600 mt-4 inline-block hover:underline"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
          <Footer />
        </main>
      </HydrateClient>
    );
  }

  // Bu kategorideki ilanlar (ileride API'dan alınacak, şimdi örnek veriler)
  const listings = [
    {
      id: 1,
      title: "İçme suyu ihtiyacı",
      location: "Kadıköy, İstanbul",
      createdAt: "2 saat önce",
      urgent: true,
    },
    {
      id: 2,
      title: "Battaniye ihtiyacı",
      location: "Beşiktaş, İstanbul",
      createdAt: "3 saat önce",
      urgent: false,
    },
    {
      id: 3,
      title: "Gıda yardımı",
      location: "Şişli, İstanbul",
      createdAt: "5 saat önce",
      urgent: true,
    },
  ];

  return (
    <HydrateClient>
      <main className="bg-accent-50 flex min-h-screen flex-col">
        <Header />

        <div className="container mx-auto flex-1 px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-primary-700 text-3xl font-bold">
              {category.name}
            </h1>
            <span className="bg-accent-200 text-secondary-700 rounded-full px-3 py-1">
              {category.count} ilan
            </span>
          </div>

          <p className="text-secondary-700 mb-8">{category.description}</p>

          <div className="mb-6 flex justify-between">
            <button className="border-accent-300 text-secondary-700 hover:border-primary-400 hover:text-primary-600 rounded-md border bg-white px-4 py-2">
              Filtreleme
            </button>
            <Link
              href="/ihtiyacim-var"
              className="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 font-medium text-white"
            >
              İhtiyaç İlanı Oluştur
            </Link>
          </div>

          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="rounded-lg bg-white p-4 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-primary-700 text-lg font-medium">
                      {listing.title}
                    </h2>
                    <p className="text-secondary-600 text-sm">
                      {listing.location} • {listing.createdAt}
                    </p>
                  </div>
                  {listing.urgent && (
                    <span className="bg-primary-100 text-primary-700 rounded-full px-2 py-1 text-xs font-medium">
                      Acil
                    </span>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/ilan/${listing.id}`}
                    className="text-primary-600 hover:bg-primary-50 rounded px-3 py-1 text-sm"
                  >
                    Detayları Gör
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </main>
    </HydrateClient>
  );
}
