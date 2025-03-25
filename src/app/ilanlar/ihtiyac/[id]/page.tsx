"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import Header from "~/app/_components/header";
import Footer from "~/app/_components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSession, signIn } from "next-auth/react";
import {
  formatDistanceToNow,
  differenceInMilliseconds,
  format,
  isValid,
  parseISO,
} from "date-fns";
import { tr } from "date-fns/locale";

// Types
interface Tag {
  id: string;
  name: string;
  value: string;
}

interface TagRelation {
  tag: Tag;
  tagId: string;
}

// NeedPost interface used in this component
interface NeedPost {
  id: string;
  title: string;
  description: string;
  status: string;
  isUrgent: boolean;
  isAnonymous: boolean;
  isExpired?: boolean;
  contactMethod?: string | null;
  contactDetail?: string | null;
  locationLat: number;
  locationLng: number;
  locationName?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  expiresAt?: string | Date | null;
  userId: string;
  categoryId: string;
  category?: { id: string; name: string; slug: string };
  subCategory?: { id: string; name: string; slug: string } | null;
  tags?: TagRelation[];
  helpOffers?: Array<{
    id: string;
    status: string;
    message?: string | null;
    userId: string;
  }>;
}

// Dynamic import with no SSR for the Map component
const Map = dynamic(() => import("~/app/_components/map"), {
  ssr: false,
  loading: () => (
    <div className="h-80 w-full animate-pulse rounded-lg bg-gray-200"></div>
  ),
});

// Düzgün şekilde tarih dönüşümü yapmak için yardımcı fonksiyon
const parseDateSafely = (
  dateValue: string | Date | null | undefined,
): Date | null => {
  if (!dateValue) return null;

  try {
    const parsedDate =
      typeof dateValue === "string" ? parseISO(dateValue) : dateValue;
    return isValid(parsedDate) ? parsedDate : null;
  } catch {
    return null;
  }
};

// ISO tarih formatı için yardımcı fonksiyon
const toISODateStringSafe = (
  dateValue: string | Date | null | undefined,
): string => {
  const parsedDate = parseDateSafely(dateValue);
  if (!parsedDate) return new Date().toISOString();

  return parsedDate.toISOString();
};

export default function NeedPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { status } = useSession();
  const [offerMessage, setOfferMessage] = useState("");
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const calculateRemainingTimePercentage = (
    createdAt: Date | string | null | undefined,
    expiresAt: Date | string | null | undefined,
  ): number => {
    const parsedCreatedAt = parseDateSafely(createdAt);
    const parsedExpiresAt = parseDateSafely(expiresAt);

    if (!parsedCreatedAt || !parsedExpiresAt) return 0;

    const current = now;

    if (current > parsedExpiresAt) return 100;

    const totalDuration = differenceInMilliseconds(
      parsedExpiresAt,
      parsedCreatedAt,
    );

    const elapsedTime = differenceInMilliseconds(current, parsedCreatedAt);

    const percentage = (elapsedTime / totalDuration) * 100;

    return Math.min(Math.max(percentage, 0), 100);
  };

  const getTimeBarColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-orange-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const isAuthenticated = status === "authenticated";

  const showLogin = () => void signIn();

  const {
    data: post,
    isLoading,
    error,
  } = api.needPost.getById.useQuery(
    { id },
    {
      refetchOnWindowFocus: false,
    },
  );

  const createHelpOffer = api.helpOffer.create.useMutation({
    onSuccess: () => {
      setSubmittingOffer(false);
      setOfferMessage("");

      window.location.reload();
    },
    onError: (error) => {
      setSubmittingOffer(false);
      alert(error.message);
    },
  });

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "unauthenticated") {
      void signIn();
      return;
    }

    if (!offerMessage.trim()) {
      alert("Lütfen bir mesaj yazın");
      return;
    }

    setSubmittingOffer(true);
    createHelpOffer.mutate({
      needPostId: id,
      message: offerMessage,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-12">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="flex items-center justify-center py-12">
              <div className="border-primary-500 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-12">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="rounded-lg bg-red-50 p-6 text-center shadow">
              <h1 className="text-xl font-bold text-red-700">
                İhtiyaç ilanı bulunamadı
              </h1>
              <p className="mt-2 text-red-600">
                Aradığınız ilan silinmiş veya yayından kaldırılmış olabilir.
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="bg-primary-600 hover:bg-primary-700 inline-block rounded-lg px-4 py-2 text-white transition"
                >
                  Ana Sayfaya Dön
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDateLocalized = (
    dateValue: string | Date | null | undefined,
  ): string => {
    const parsedDate = parseDateSafely(dateValue);
    if (!parsedDate) return "bilinmeyen tarihte";

    return format(parsedDate, "PPP", { locale: tr });
  };

  const formatDistanceLocalized = (
    dateValue: string | Date | null | undefined,
  ): string => {
    const parsedDate = parseDateSafely(dateValue);
    if (!parsedDate) return "belirtilmeyen bir sürede";

    return formatDistanceToNow(parsedDate, { addSuffix: true, locale: tr });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Post Header */}
          <div className="mb-8 overflow-hidden rounded-lg bg-white shadow">
            <div className="from-primary-600 to-primary-400 relative h-40 bg-gradient-to-r">
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-center text-2xl font-bold text-white md:text-3xl">
                  {post.title}
                </h1>
              </div>
            </div>

            <div className="p-6">
              {/* Status & Date */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    {post.status === "PENDING"
                      ? "Beklemede"
                      : post.status === "INPROGRESS"
                        ? "Devam Ediyor"
                        : post.status === "COMPLETED"
                          ? "Tamamlandı"
                          : "İptal Edildi"}
                  </span>
                  {post.isUrgent && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                      Acil
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  <time dateTime={toISODateStringSafe(post.createdAt)}>
                    {formatDateLocalized(post.createdAt)}
                  </time>
                </div>
              </div>

              {/* İhtiyacın zaman aşımına uğrayıp uğramadığını kontrol et */}
              {post.isExpired && (
                <div className="mb-6 rounded-md bg-amber-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-amber-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">
                        Zaman Aşımı
                      </h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p>
                          Bu ihtiyaç ilanı zaman aşımına uğramıştır. İlan sahibi
                          ile iletişime geçmek veya yardım teklifi göndermek
                          artık mümkün değildir.
                        </p>
                        <p className="mt-1">
                          İlan {formatDateLocalized(post.createdAt)}{" "}
                          oluşturuldu, {formatDateLocalized(post.expiresAt)}{" "}
                          sona erdi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Geri sayım bilgisi */}
              {!post.isExpired && (
                <div className="mb-6 rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 w-full">
                      <h3 className="text-sm font-medium text-blue-800">
                        İlan Süresi
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p className="mb-2">
                          Bu ihtiyaç ilanı{" "}
                          <strong>
                            {formatDistanceLocalized(post.expiresAt)}
                          </strong>{" "}
                          sona erecek.
                        </p>

                        {/* İlerleme çubuğu - kalan süreyi görsel olarak göster */}
                        <div className="mt-3 h-2.5 w-full rounded-full bg-gray-200">
                          <div
                            className={`h-2.5 rounded-full ${getTimeBarColor(
                              calculateRemainingTimePercentage(
                                post.createdAt,
                                post.expiresAt,
                              ),
                            )}`}
                            style={{
                              width: `${calculateRemainingTimePercentage(
                                post.createdAt,
                                post.expiresAt,
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Kategori:</span>
                  <span className="font-medium text-gray-900">
                    {post.category?.name || "Kategori Belirtilmemiş"}
                    {post.subCategory && ` › ${post.subCategory.name}`}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <p className="whitespace-pre-line text-gray-700">
                  {post.description}
                </p>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tagRelation: TagRelation) => (
                      <span
                        key={tagRelation.tag.id}
                        className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
                      >
                        {tagRelation.tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location Map */}
          <div className="mb-8 overflow-hidden rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Konum</h2>

            {isAuthenticated ? (
              <div className="overflow-hidden rounded-lg">
                <Map
                  lat={post.locationLat}
                  lng={post.locationLng}
                  height="300px"
                  zoom={14}
                />
              </div>
            ) : (
              <div className="rounded-md bg-blue-50 p-4">
                <p className="text-sm text-blue-700">
                  Konum bilgisini görmek için giriş yapmalısınız.
                </p>
                <button
                  onClick={showLogin}
                  className="mt-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                >
                  Giriş Yap
                </button>
              </div>
            )}
          </div>

          {/* Contact Information (if available) */}
          {post.contactMethod && post.contactDetail && (
            <div className="mb-8 overflow-hidden rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                İletişim Bilgileri
              </h2>

              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">İletişim Yöntemi:</span>
                    <span className="text-gray-700">
                      {post.contactMethod === "phone"
                        ? "Telefon"
                        : post.contactMethod === "email"
                          ? "E-posta"
                          : post.contactMethod === "instagram"
                            ? "Instagram"
                            : post.contactMethod === "telegram"
                              ? "Telegram"
                              : "Diğer"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">İletişim Detayı:</span>
                    <span className="text-gray-700">{post.contactDetail}</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-md bg-blue-50 p-4">
                  <p className="text-sm text-blue-700">
                    İletişim bilgilerini görmek için giriş yapmalısınız.
                  </p>
                  <button
                    onClick={showLogin}
                    className="mt-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                  >
                    Giriş Yap
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Help Offer Form */}
          <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Yardım Teklifi Gönder
            </h2>

            <div className="mb-4 rounded-md bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                Yardım teklifi özelliği şu anda bakım nedeniyle geçici olarak
                devre dışıdır.
              </p>
            </div>

            <form onSubmit={handleOfferSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Nasıl yardım edebileceğinizi açıklayın"
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  disabled={true}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={true}
                className="w-full cursor-not-allowed rounded-lg bg-gray-400 px-4 py-3 font-medium text-white disabled:opacity-70"
              >
                {submittingOffer ? "Gönderiliyor..." : "Yardım Teklifi Gönder"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
