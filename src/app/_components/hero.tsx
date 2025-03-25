import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export const Hero = () => {
  return (
    <div className="bg-primary-500 mb-8 rounded-lg p-6 text-white">
      <h1 className="mb-4 text-3xl font-bold">Birlikte Daha Güçlüyüz</h1>
      <p className="mb-6 text-lg">
        İhtiyaç sahipleri ve yardım etmek isteyenleri bir araya getiren
        platform. Hemen bir ilan oluşturun veya mevcut ilanları inceleyin.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/ilanlar"
          className="text-primary-600 hover:bg-accent-100 rounded-md bg-white px-5 py-2.5 font-medium"
        >
          İlanları Gör
        </Link>

        <Dialog>
          <DialogTrigger asChild>
            <button className="hover:bg-primary-600 rounded-md border-2 border-white bg-transparent px-5 py-2.5 font-medium text-white">
              Nasıl Çalışır?
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Platform Nasıl Çalışır?</DialogTitle>
              <DialogDescription>
                Dayanışma Platformu&apos;nun nasıl çalıştığına dair hızlı
                bilgiler
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <h3 className="text-primary-600 font-medium">
                  1. İlan Oluştur
                </h3>
                <p className="text-secondary-700 text-sm">
                  İhtiyacınızı veya yardım teklifinizi belirtin, kategori seçin
                  ve konum ekleyin.
                </p>
              </div>
              <div className="grid gap-2">
                <h3 className="text-primary-600 font-medium">2. Eşleştirme</h3>
                <p className="text-secondary-700 text-sm">
                  Sistem, ilan ve konumlara göre otomatik eşleştirmeler sunar.
                </p>
              </div>
              <div className="grid gap-2">
                <h3 className="text-primary-600 font-medium">3. İletişim</h3>
                <p className="text-secondary-700 text-sm">
                  Eşleşme sonrası platformumuz üzerinden güvenli iletişim
                  kurabilirsiniz.
                </p>
              </div>
            </div>
            <DialogFooter className="flex justify-between sm:justify-between">
              <Link
                href="/hakkimizda"
                className="text-primary-600 text-sm hover:underline"
              >
                Daha Fazla Bilgi
              </Link>
              <Button type="button" variant="default">
                Anladım
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Link
          href="/olustur"
          className="hover:bg-primary-600 rounded-md border-2 border-white bg-transparent px-5 py-2.5 font-medium text-white"
        >
          İlan Oluştur
        </Link>
      </div>
    </div>
  );
};

export default Hero;
