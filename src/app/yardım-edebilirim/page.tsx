"use client";

import { ActionButton } from "../_components/auth";
import Header from "../_components/header";
import Footer from "../_components/footer";

export default function HelpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Yardım Edebilirim
            </h1>
            <p className="mt-2 text-gray-600">
              İnsanlara nasıl yardım edebileceğinizi anlatın
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow md:p-8">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="category"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Yardım Kategorisi
                </label>
                <select
                  id="category"
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Kategori Seçin</option>
                  <option value="food">Gıda</option>
                  <option value="housing">Barınma</option>
                  <option value="clothing">Giyim</option>
                  <option value="health">Sağlık</option>
                  <option value="education">Eğitim</option>
                  <option value="transportation">Ulaşım</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Başlık
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Sunabileceğiniz yardımı kısaca açıklayın"
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Detaylı Açıklama
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Nasıl yardım edebileceğinizi detaylı olarak açıklayın"
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="availableFrom"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    id="availableFrom"
                    className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="availableTo"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Bitiş Tarihi (Opsiyonel)
                  </label>
                  <input
                    type="date"
                    id="availableTo"
                    className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  İletişim Tercihi
                </label>
                <select
                  id="contact"
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="phone">Telefon</option>
                  <option value="email">E-posta</option>
                  <option value="app">Uygulama içi mesaj</option>
                </select>
              </div>

              <ActionButton
                label="Yardım Teklifimi Yayınla"
                onClick={() => {
                  console.log("Yardım teklifi yayınlandı");
                }}
                className="w-full py-3"
              />
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
