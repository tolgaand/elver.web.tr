"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaHandHoldingHeart,
  FaUsers,
  FaCheckCircle,
  FaLink,
} from "react-icons/fa";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({
  isOpen,
  onClose,
}: HowItWorksModalProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "timing" | "location"
  >("overview");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Elver - Nasıl Çalışır?
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex border-b border-gray-200">
          <button
            className={`-mb-px px-3 py-2 text-sm font-medium ${
              activeTab === "overview"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Genel Bakış
          </button>
          <button
            className={`-mb-px px-3 py-2 text-sm font-medium ${
              activeTab === "timing"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("timing")}
          >
            Zaman Sistemi
          </button>
          <button
            className={`-mb-px px-3 py-2 text-sm font-medium ${
              activeTab === "location"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("location")}
          >
            Davet Sistemi
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="mx-auto w-full max-w-4xl">
            <p className="mb-6 text-center text-sm text-gray-600">
              Elver, belirli bir bölgede ihtiyaç duyulan malzeme/yardımların
              hızlıca o bölgedeki kişilere ulaştırılmasını sağlayan bir topluluk
              dayanışma platformudur. Davet sistemiyle çalışan Elver, güvenilir
              bir ağ oluşturarak ihtiyaçların hızlı ve güvenli bir şekilde
              karşılanmasını amaçlar.
            </p>

            <div className="relative">
              {/* Timeline Çizgisi */}
              <div className="absolute top-0 left-1/2 -ml-px h-full w-0.5 bg-blue-200"></div>

              {/* Adım 1: İhtiyaç Oluşturma */}
              <div className="relative mb-10">
                <div className="flex items-center">
                  <div className="flex w-1/2 justify-end pr-5">
                    <div className="max-w-sm rounded-lg bg-white p-4 shadow-md">
                      <h3 className="mb-1 text-base font-medium text-gray-900">
                        İhtiyaç Oluşturma
                      </h3>
                      <p className="text-xs text-gray-600">
                        Kullanıcı sadece ihtiyacını ve iletişim bilgilerini
                        belirtir. Konum izni verildiğinde sistem otomatik olarak
                        kullanıcının konumunu tespit eder. İhtiyaç türü, miktar
                        ve aciliyet derecesi girilerek ilan oluşturulur.
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 transform">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
                      1
                    </div>
                  </div>
                  <div className="w-1/2 pl-5"></div>
                </div>
              </div>

              {/* Adım 2: Haritada Görünür */}
              <div className="relative mb-10">
                <div className="flex items-center">
                  <div className="w-1/2 pr-5"></div>
                  <div className="absolute left-1/2 -translate-x-1/2 transform">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
                      2
                    </div>
                  </div>
                  <div className="flex w-1/2 justify-start pl-5">
                    <div className="max-w-sm rounded-lg bg-white p-4 shadow-md">
                      <h3 className="mb-1 text-base font-medium text-gray-900">
                        Bilgilendirme
                      </h3>
                      <p className="text-xs text-gray-600">
                        Oluşturulan ihtiyaç ilanı anında haritada görünür hale
                        gelir ve o bölgedeki tüm kullanıcılara bildirim
                        gönderilir. Kullanıcılar harita üzerinden etraflarındaki
                        aktif ihtiyaçları kolayca görebilirler.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adım 3: İletişim */}
              <div className="relative mb-10">
                <div className="flex items-center">
                  <div className="flex w-1/2 justify-end pr-5">
                    <div className="max-w-sm rounded-lg bg-white p-4 shadow-md">
                      <h3 className="mb-1 text-base font-medium text-gray-900">
                        İletişim
                      </h3>
                      <p className="text-xs text-gray-600">
                        Sisteme üye olan herkes, ihtiyacı görerek doğrudan
                        iletişim bilgileri üzerinden ihtiyaç sahibine
                        ulaşabilir. İletişim bilgileri üzerinden koordinasyon
                        sağlanır ve yardımın nasıl ulaştırılacağı
                        kararlaştırılır.
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 transform">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
                      3
                    </div>
                  </div>
                  <div className="w-1/2 pl-5"></div>
                </div>
              </div>

              {/* Adım 4: Süre Sona Erme */}
              <div className="relative">
                <div className="flex items-center">
                  <div className="w-1/2 pr-5"></div>
                  <div className="absolute left-1/2 -translate-x-1/2 transform">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
                      4
                    </div>
                  </div>
                  <div className="flex w-1/2 justify-start pl-5">
                    <div className="max-w-sm rounded-lg bg-white p-4 shadow-md">
                      <h3 className="mb-1 text-base font-medium text-gray-900">
                        Süre Bitimi
                      </h3>
                      <p className="text-xs text-gray-600">
                        İlan oluşturulurken belirlenen süre dolduğunda ilan
                        otomatik olarak pasif duruma geçer ve haritadan
                        kaldırılır. Bu sayede sadece aktif ve çözülmemiş
                        ihtiyaçlar görünür kalır. İhtiyaç karşılandığında
                        kullanıcı manuel olarak da ilanı kapatabilir.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "timing" && (
          <div className="mx-auto w-full max-w-4xl px-2">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <FaClock className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <p className="mb-4 text-center text-sm text-gray-600">
              Elver&apos;de tüm ilanlar belirli bir süre için aktif kalır. Bu
              süre sistemi, acil ihtiyaçlara öncelik vermemizi ve haritayı
              güncel tutmamızı sağlar. İhtiyacınızın aciliyet derecesine göre
              uygun süreyi seçebilirsiniz.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-white p-4 shadow-md">
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  İlan Süreleri
                </h4>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span>15 dakika - En acil ihtiyaçlar</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span>30 dakika - Standart süre</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span>45 dakika - Orta vadeli ihtiyaçlar</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span>60 dakika - Uzun vadeli ihtiyaçlar</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span>90 dakika - Maksimum süre</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-md">
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  İlerleme Çubuğu
                </h4>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                    <span>Yeşil: %0-50 - Yeterli süre var</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
                    <span>Sarı: %50-70 - Süre azalıyor</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
                    <span>Turuncu: %70-90 - Az süre kaldı</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                    <span>Kırmızı: %90-100 - Süre bitmek üzere</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "location" && (
          <div className="mx-auto w-full max-w-4xl px-2">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <FaLink className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <h3 className="mb-2 text-center text-base font-medium text-gray-900">
              Davet & Referans Sistemi
            </h3>

            <p className="mb-4 text-center text-xs text-gray-600">
              Elver, güvenli bir topluluk oluşturmak için davet sistemiyle
              çalışır. Sadece mevcut üyelerin davet ettiği kişiler sisteme
              katılabilir. Bu sayede platformda sadece güvenilir kişiler yer
              alır ve kötüye kullanımın önüne geçilir.
            </p>

            <div className="mb-4 rounded-lg bg-white p-4 shadow-md">
              <h4 className="mb-2 text-sm font-medium text-gray-900">
                Davet Sistemi Nasıl Çalışır?
              </h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <FaCheckCircle className="h-2.5 w-2.5 text-green-600" />
                  </div>
                  <span>
                    Elver&apos;e sadece mevcut bir üyenin daveti ile
                    katılabilirsiniz. Davet olmadan kayıt yapılamaz.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <FaCheckCircle className="h-2.5 w-2.5 text-green-600" />
                  </div>
                  <span>
                    Her üye sınırlı sayıda (5) kişiyi davet edebilir. Bu sınır,
                    sistemin güvenliğini korumak için önemlidir.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <FaCheckCircle className="h-2.5 w-2.5 text-green-600" />
                  </div>
                  <span>
                    Profil sayfanızdan kendi davet linkinizi alabilir ve
                    güvendiğiniz kişilerle paylaşabilirsiniz. Davet linki kişiye
                    özeldir ve sınırlı kullanıma sahiptir.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs text-blue-700">
                <strong>Neden Davet Sistemi?</strong> Bu sistem, platformda
                güvenilir bir topluluk oluşturmamızı ve sadece gerçek
                ihtiyaçların paylaşılmasını sağlar. Sisteme katılan herkes,
                birinin referansı ile geldiği için güvenilirlik düzeyi
                yüksektir. Böylece daha hızlı ve etkili bir dayanışma ağı
                kurulur.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
