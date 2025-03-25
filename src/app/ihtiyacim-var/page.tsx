"use client";

import { useState } from "react";
import Header from "../_components/header";
import Footer from "../_components/footer";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AuthModal from "../_components/auth-modal";

// Create an enum for contact preferences
enum ContactPreference {
  PHONE = "phone",
  EMAIL = "email",
  INSTAGRAM = "instagram",
  TELEGRAM = "telegram",
}

// Timeout seçenekleri
enum TimeoutOption {
  MINUTES_15 = "15",
  MINUTES_30 = "30",
  MINUTES_45 = "45",
  MINUTES_60 = "60",
  MINUTES_90 = "90",
}

export default function IhtiyacimVarPage() {
  const router = useRouter();
  const { status } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactPreference>(
    ContactPreference.PHONE,
  );
  const [contactDetail, setContactDetail] = useState("");
  const [timeout, setTimeout] = useState<TimeoutOption>(
    TimeoutOption.MINUTES_30,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const createNeedPost = api.needPost.create.useMutation({
    onSuccess: (data) => {
      setSubmitting(false);

      router.push(`/ilanlar/ihtiyac/${data.needPost.id}`);
    },
    onError: (error) => {
      setSubmitting(false);
      setError(error.message);
    },
  });

  const showContactDetailInput = true;

  const handleContactMethodChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newContactMethod = e.target.value as ContactPreference;
    setContactMethod(newContactMethod);

    setContactDetail("");
  };

  const getPlaceholderText = () => {
    switch (contactMethod) {
      case ContactPreference.PHONE:
        return "+90 555 123 4567";
      case ContactPreference.EMAIL:
        return "ornek@email.com";
      case ContactPreference.INSTAGRAM:
        return "@kullanici_adi";
      case ContactPreference.TELEGRAM:
        return "@kullanici_adi";
      default:
        return "";
    }
  };

  const getInputType = () => {
    switch (contactMethod) {
      case ContactPreference.EMAIL:
        return "email";
      case ContactPreference.PHONE:
        return "tel";
      default:
        return "text";
    }
  };

  const getInputLabel = () => {
    switch (contactMethod) {
      case ContactPreference.PHONE:
        return "Telefon Numarası";
      case ContactPreference.EMAIL:
        return "E-posta Adresi";
      case ContactPreference.INSTAGRAM:
        return "Instagram Kullanıcı Adı";
      case ContactPreference.TELEGRAM:
        return "Telegram Kullanıcı Adı";
      default:
        return "İletişim Bilgisi";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (status !== "authenticated") {
      setShowAuthModal(true);
      return;
    }

    setError(null);
    setSubmitting(true);

    if (!contactDetail) {
      setError("İletişim bilgisi girilmelidir");
      setSubmitting(false);
      return;
    }

    if (contactMethod === ContactPreference.PHONE) {
      if (!/^\+?[0-9]{10,15}$/.test(contactDetail)) {
        setError("Geçerli bir telefon numarası giriniz");
        setSubmitting(false);
        return;
      }
    } else if (contactMethod === ContactPreference.EMAIL) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetail)) {
        setError("Geçerli bir e-posta adresi giriniz");
        setSubmitting(false);
        return;
      }
    } else if (
      contactMethod === ContactPreference.INSTAGRAM ||
      contactMethod === ContactPreference.TELEGRAM
    ) {
      if (!/^@?[a-zA-Z0-9_.]{1,30}$/.test(contactDetail)) {
        setError("Geçerli bir kullanıcı adı giriniz");
        setSubmitting(false);
        return;
      }
    }

    let formattedContactDetail = contactDetail;
    if (
      (contactMethod === ContactPreference.INSTAGRAM ||
        contactMethod === ContactPreference.TELEGRAM) &&
      !formattedContactDetail.startsWith("@") &&
      formattedContactDetail.length > 0
    ) {
      formattedContactDetail = "@" + formattedContactDetail;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          createNeedPost.mutate({
            title,
            description,
            contactMethod,
            contactDetail: formattedContactDetail,
            locationLat: position.coords.latitude,
            locationLng: position.coords.longitude,
            timeout,
          });
        },
        (error) => {
          setSubmitting(false);
          setError("Konum bilginiz alınamadı. Lütfen konum izni verin.");
          console.error("Error getting location:", error);
        },
      );
    } else {
      setSubmitting(false);
      setError("Tarayıcınız konum desteği sağlamıyor.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              İhtiyacınızı Belirtin
            </h1>
            <p className="mt-2 text-gray-600">
              Size nasıl yardımcı olabileceğimizi anlatın
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow md:p-8">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
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
                  placeholder="İhtiyacınızı kısaca açıklayın"
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={3}
                  maxLength={100}
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
                  placeholder="İhtiyacınızı detaylı olarak açıklayın"
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  minLength={10}
                  maxLength={1000}
                ></textarea>
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
                  value={contactMethod}
                  onChange={handleContactMethodChange}
                >
                  <option value={ContactPreference.PHONE}>Telefon</option>
                  <option value={ContactPreference.EMAIL}>E-posta</option>
                  <option value={ContactPreference.INSTAGRAM}>Instagram</option>
                  <option value={ContactPreference.TELEGRAM}>Telegram</option>
                </select>
              </div>

              {showContactDetailInput && (
                <div>
                  <label
                    htmlFor="contactDetail"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    {getInputLabel()}
                  </label>
                  <input
                    type={getInputType()}
                    id="contactDetail"
                    placeholder={getPlaceholderText()}
                    className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    value={contactDetail}
                    onChange={(e) => setContactDetail(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="timeout"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  İlan Gösterim Süresi
                </label>
                <select
                  id="timeout"
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={timeout}
                  onChange={(e) => setTimeout(e.target.value as TimeoutOption)}
                >
                  <option value={TimeoutOption.MINUTES_15}>15 dakika</option>
                  <option value={TimeoutOption.MINUTES_30}>30 dakika</option>
                  <option value={TimeoutOption.MINUTES_45}>45 dakika</option>
                  <option value={TimeoutOption.MINUTES_60}>1 saat</option>
                  <option value={TimeoutOption.MINUTES_90}>1.5 saat</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  İlanınız bu süre sonunda otomatik olarak zaman aşımına
                  uğrayacak ve aktif olarak gösterilmeyecektir.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-primary-500 hover:bg-primary-600 w-full rounded-lg px-4 py-3 font-medium text-white focus:outline-none disabled:opacity-70"
              >
                {submitting ? "Gönderiliyor..." : "İhtiyacımı Paylaş"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
