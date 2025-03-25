import Header from "~/app/_components/header";
import Footer from "~/app/_components/footer";

export default function CommunityRulesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-lg bg-white p-8 shadow">
            <h1 className="mb-6 text-3xl font-bold text-gray-900">
              Topluluk Kuralları
            </h1>

            <div className="prose max-w-none">
              <p className="mb-4">
                Elver platformu, birbirimize yardım etmek ve dayanışma sağlamak
                amacıyla kurulmuş bir topluluktur. Platformun sağlıklı ve
                güvenli bir şekilde işleyebilmesi için lütfen aşağıdaki
                kurallara uyunuz:
              </p>

              <h2 className="mt-8 mb-4 text-xl font-semibold">Genel İlkeler</h2>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Bu platform, siyasi bir amaç gütmemekte ve herhangi bir siyasi
                  görüşü desteklememektedir. Tamamen insani yardımlaşma
                  amaçlıdır.
                </li>
                <li>
                  Platformdaki tüm kullanıcılar birbirlerine saygılı
                  davranmalıdır. Hakaret, küfür, aşağılama ve her türlü ayrımcı
                  söylem yasaktır.
                </li>
                <li>
                  Platformda paylaşılan bilgilerin doğruluğundan emin olunuz.
                  Yanlış veya yanıltıcı bilgiler paylaşmak yasaktır.
                </li>
                <li>
                  Başkalarının kişisel bilgilerini izinsiz paylaşmak yasaktır.
                </li>
                <li>
                  Platform üzerinden yapılan yardımlaşma faaliyetlerinde dürüst
                  ve şeffaf olunuz.
                </li>
              </ol>

              <h2 className="mt-8 mb-4 text-xl font-semibold">
                İhtiyaç İlanları
              </h2>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Gerçek ihtiyaçlarınızı açık ve net bir şekilde belirtiniz.
                </li>
                <li>
                  Bir ilan oluştururken, gerçekçi ve makul talepler iletiniz.
                </li>
                <li>Aynı ihtiyaç için birden fazla ilan oluşturmayınız.</li>
                <li>
                  İhtiyacınız karşılandığında, ilanı güncelleyerek durumu
                  belirtiniz.
                </li>
              </ol>

              <h2 className="mt-8 mb-4 text-xl font-semibold">
                Yardım Teklifleri
              </h2>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Yapabileceğiniz yardımları teklif ediniz,
                  gerçekleştiremeyeceğiniz vaatlerde bulunmayınız.
                </li>
                <li>Yardım teklifi yaparken açık ve net olunuz.</li>
                <li>
                  Bir yardım teklifi kabul edildiğinde, sorumluluklarınızı
                  yerine getiriniz.
                </li>
              </ol>

              <h2 className="mt-8 mb-4 text-xl font-semibold">
                Uyarılar ve Sorumluluk Reddi
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Platform üzerinden gerçekleştirilen tüm etkileşimler,
                  kullanıcıların kendi sorumluluğundadır.
                </li>
                <li>
                  Platform, kullanıcılar arasında oluşabilecek anlaşmazlıklarda
                  arabuluculuk yapmaz ve sorumlu tutulamaz.
                </li>
                <li>
                  Kurallara uymayanların hesapları geçici veya kalıcı olarak
                  kapatılabilir.
                </li>
                <li>
                  Bu kurallar, topluluk güvenliği ve platformun sağlıklı
                  işleyişi için gerektiğinde güncellenebilir.
                </li>
              </ul>

              <p className="mt-8 text-gray-700">
                Bu platformda yer almak, yukarıdaki kuralları kabul ettiğiniz
                anlamına gelir. Hep birlikte daha güzel bir topluluk inşa etmek
                için kurallara uyalım ve birbirimize destek olalım.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
