import Header from "~/app/_components/header";
import Footer from "~/app/_components/footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-lg bg-white p-8 shadow">
            <h1 className="mb-6 text-3xl font-bold text-gray-900">
              Gizlilik Politikası
            </h1>

            <div className="prose max-w-none">
              <p className="mb-4">
                Elver platformu olarak, kullanıcılarımızın gizliliğine saygı
                duyuyoruz. Bu gizlilik politikası, platformumuzu kullanırken
                hangi bilgilerin toplandığını ve bu bilgilerin nasıl
                kullanıldığını açıklamaktadır.
              </p>

              <h2 className="mt-8 mb-4 text-xl font-semibold">
                Topladığımız Bilgiler
              </h2>
              <p className="mb-2">
                Platformumuz aşağıdaki bilgileri toplayabilir:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Hesap Bilgileri:</strong> E-posta adresiniz, telefon
                  numaranız ve adınız gibi temel iletişim bilgileri.
                </li>
                <li>
                  <strong>Konum Bilgileri:</strong> İhtiyaç veya yardım
                  ilanlarınızın doğru kişilere ulaşabilmesi için konum
                  bilgileriniz.
                </li>
                <li>
                  <strong>İlan Bilgileri:</strong> Platform üzerinde
                  oluşturduğunuz ihtiyaç veya yardım ilanlarına ilişkin
                  bilgiler.
                </li>
                <li>
                  <strong>Kullanım Verileri:</strong> Platformu nasıl
                  kullandığınıza dair bilgiler, ziyaret ettiğiniz sayfalar ve
                  tıkladığınız bağlantılar.
                </li>
              </ul>

              <h2 className="mt-8 mb-4 text-xl font-semibold">
                Bilgilerin Kullanımı
              </h2>
              <p className="mb-2">
                Topladığımız bilgileri aşağıdaki amaçlarla kullanıyoruz:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Hesabınızı oluşturmak ve yönetmek</li>
                <li>Platform hizmetlerini sağlamak ve iyileştirmek</li>
                <li>
                  İhtiyaç sahipleri ile yardım etmek isteyenleri buluşturmak
                </li>
                <li>Platformun güvenliğini sağlamak</li>
                <li>Platformla ilgili önemli bildirimler göndermek</li>
              </ul>

              <h2 className="mt-8 mb-4 text-xl font-semibold">
                Bilgi Paylaşımı
              </h2>
              <p className="mb-4">
                Kişisel bilgilerinizi, rızanız olmadan üçüncü taraflarla
                paylaşmayız. Ancak aşağıdaki durumlarda bilgi paylaşımı
                yapabiliriz:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Yardım Amaçlı Paylaşım:</strong> Platformumuzun amacı
                  doğrultusunda, ihtiyaç sahipleri ile yardım etmek isteyenlerin
                  birbirlerini bulabilmeleri için gerekli olan bilgileri
                  paylaşabiliriz.
                </li>
                <li>
                  <strong>Yasal Zorunluluklar:</strong> Yasal bir zorunluluk
                  olduğunda, mahkeme kararı veya yasal bir taleple
                  karşılaştığımızda bilgi paylaşımı yapabiliriz.
                </li>
              </ul>

              <h2 className="mt-8 mb-4 text-xl font-semibold">
                Veri Güvenliği
              </h2>
              <p className="mb-4">
                Kişisel bilgilerinizin güvenliğini sağlamak için çeşitli
                güvenlik önlemleri alıyoruz. Ancak, internet üzerinden hiçbir
                veri iletiminin %100 güvenli olmadığını unutmayın.
              </p>

              <h2 className="mt-8 mb-4 text-xl font-semibold">
                Sorumluluk Reddi
              </h2>
              <p className="mb-4">
                Elver platformu, tamamen gönüllülük esasına dayalı olarak,
                insani yardımlaşma amacıyla kurulmuştur. Platform üzerinden
                gerçekleştirilen etkileşimlerden ve bilgi paylaşımlarından
                doğabilecek sonuçlardan platform yönetimi sorumlu tutulamaz.
              </p>
              <p className="mb-4">
                Platformumuz, kullanıcılar arasındaki iletişimi kolaylaştırmak
                dışında bir sorumluluk üstlenmemektedir. Kullanıcılar, platform
                üzerinden gerçekleştirdikleri tüm etkileşimlerin kendi
                sorumluluklarında olduğunu kabul etmektedirler.
              </p>
              <p className="mb-4">
                Bu platform, herhangi bir siyasi görüş, düşünce veya ideolojiyi
                temsil etmemektedir. Tamamen insani yardımlaşma amacıyla
                kurulmuştur.
              </p>

              <h2 className="mt-8 mb-4 text-xl font-semibold">
                Politika Değişiklikleri
              </h2>
              <p className="mb-4">
                Bu gizlilik politikası, gerektiğinde güncellenebilir. Önemli
                değişiklikler olduğunda kullanıcılarımıza bildirim yapacağız.
              </p>

              <h2 className="mt-8 mb-4 text-xl font-semibold">İletişim</h2>
              <p className="mb-4">
                Gizlilik politikamızla ilgili sorularınız veya endişeleriniz
                varsa, lütfen bizimle iletişime geçin: info@elver.web.tr
              </p>

              <p className="mt-8 text-sm text-gray-600">
                Son güncelleme: {new Date().toLocaleDateString("tr-TR")}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
