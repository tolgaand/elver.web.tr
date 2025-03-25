import { HydrateClient } from "~/trpc/server";
import Header from "../_components/header";
import Footer from "../_components/footer";

export default function YardimEdebilirimPage() {
  return (
    <HydrateClient>
      <main className="bg-accent-50 flex min-h-screen flex-col">
        <Header />

        <div className="container mx-auto flex-1 px-4 py-8">
          <h1 className="text-primary-700 mb-6 text-3xl font-bold">
            Yardım Edebilirim
          </h1>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <p className="text-secondary-700 mb-6">
              Yardım etmek istediğiniz alanları ve yeteneklerinizi belirtin.
              Uygun kişilerle eşleştirileceksiniz.
            </p>

            <form className="space-y-6">
              <div>
                <label
                  htmlFor="categories"
                  className="text-secondary-800 mb-1 block font-medium"
                >
                  Yardım Edebileceğim Kategoriler
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="temel-ihtiyaclar"
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300"
                    />
                    <label
                      htmlFor="temel-ihtiyaclar"
                      className="text-secondary-700 ml-2"
                    >
                      Temel İhtiyaçlar
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="ulasim"
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="ulasim" className="text-secondary-700 ml-2">
                      Ulaşım
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="saglik"
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="saglik" className="text-secondary-700 ml-2">
                      Sağlık
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="teknik-destek"
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300"
                    />
                    <label
                      htmlFor="teknik-destek"
                      className="text-secondary-700 ml-2"
                    >
                      Teknik Destek
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hukuki-destek"
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300"
                    />
                    <label
                      htmlFor="hukuki-destek"
                      className="text-secondary-700 ml-2"
                    >
                      Hukuki Destek
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="diger"
                      className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="diger" className="text-secondary-700 ml-2">
                      Diğer
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="skills"
                  className="text-secondary-800 mb-1 block font-medium"
                >
                  Yeteneklerim / Ne Konuda Yardım Edebilirim
                </label>
                <textarea
                  id="skills"
                  placeholder="Yardım edebileceğiniz konuları, becerilerinizi detaylı olarak açıklayın"
                  rows={4}
                  className="border-accent-300 focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border p-2"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="availability"
                  className="text-secondary-800 mb-1 block font-medium"
                >
                  Müsait Olduğum Zamanlar
                </label>
                <input
                  type="text"
                  id="availability"
                  placeholder="Örn: Hafta içi akşamları, Cumartesi tüm gün"
                  className="border-accent-300 focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border p-2"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="text-secondary-800 mb-1 block font-medium"
                >
                  Konum
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="Örn: Kadıköy, İstanbul"
                  className="border-accent-300 focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border p-2"
                />
              </div>

              <div>
                <label
                  htmlFor="contact"
                  className="text-secondary-800 mb-1 block font-medium"
                >
                  İletişim Yöntemi
                </label>
                <select
                  id="contact"
                  className="border-accent-300 focus:border-primary-500 focus:ring-primary-500 mb-2 w-full rounded-md border p-2"
                >
                  <option value="" disabled selected>
                    İletişim yöntemi seçin
                  </option>
                  <option value="telegram">Telegram Kullanıcı Adı</option>
                  <option value="phone">Telefon Numarası</option>
                  <option value="platform">Platform İçi Mesajlaşma</option>
                </select>
                <input
                  type="text"
                  id="contactDetail"
                  placeholder="İletişim bilgisi"
                  className="border-accent-300 focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border p-2"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 rounded-md px-6 py-3 font-medium text-white"
                >
                  Kaydımı Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </main>
    </HydrateClient>
  );
}
