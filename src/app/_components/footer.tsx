import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="bg-secondary-800 py-8 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-xl font-bold">Dayanışma Platformu</h3>
            <p className="text-accent-300 mb-2">Birlikte daha güçlüyüz.</p>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold">Hızlı Bağlantılar</h3>
            <ul className="text-accent-300 space-y-2">
              <li>
                <Button
                  asChild
                  variant="link"
                  className="text-accent-300 h-auto p-0 hover:text-white"
                >
                  <Link href="/ihtiyacim-var">İhtiyaç Bildir</Link>
                </Button>
              </li>

              <li>
                <Button
                  asChild
                  variant="link"
                  className="text-accent-300 h-auto p-0 hover:text-white"
                >
                  <Link href="/kurallar">Topluluk Kuralları</Link>
                </Button>
              </li>
              <li>
                <Button
                  asChild
                  variant="link"
                  className="text-accent-300 h-auto p-0 hover:text-white"
                >
                  <Link href="/gizlilik">Gizlilik Politikası</Link>
                </Button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold">İletişim</h3>
            <p className="text-accent-300 mb-2">info@elver.web.tr</p>
          </div>
        </div>
        <Separator className="my-6 bg-gray-700" />
        <div className="text-accent-300 text-center text-sm">
          <p className="mb-2">
            &copy; {new Date().getFullYear()} Elver. Bu platform tamamen
            halkımıza yardım etmek amacıyla oluşturulmuştur.
          </p>
          <p className="text-xs">
            Sorumluluk Reddi: Bu platform aracılığıyla sağlanan bilgiler ve
            hizmetler &quot;olduğu gibi&quot; sunulmaktadır. Platform üzerinden
            gerçekleştirilen hiçbir yardım veya bağış işleminde sorumluluk kabul
            edilmemektedir. Kullanıcılar arasındaki tüm etkileşimler tamamen
            kendi sorumluluklarındadır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
