"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import Header from "~/app/_components/header";
import Footer from "~/app/_components/footer";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "~/app/_components/auth";
import dynamic from "next/dynamic";

// Dynamic import with no SSR for the Map component
const Map = dynamic(() => import("~/app/_components/map"), {
  ssr: false,
  loading: () => (
    <div className="h-80 w-full animate-pulse rounded-lg bg-gray-200"></div>
  ),
});

export default function NeedPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, showLogin } = useAuth();
  const [offerMessage, setOfferMessage] = useState("");
  const [submittingOffer, setSubmittingOffer] = useState(false);

  // Fetch need post details
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

  // Create help offer mutation
  const createHelpOffer = api.helpOffer.create.useMutation({
    onSuccess: () => {
      setSubmittingOffer(false);
      setOfferMessage("");
      // Refetch post data
      window.location.reload();
    },
    onError: (error) => {
      setSubmittingOffer(false);
      alert(error.message);
    },
  });

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showLogin();
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

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
                  <time dateTime={post.createdAt.toISOString()}>
                    {formatDate(post.createdAt)}
                  </time>
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Kategori:</span>
                  <span className="font-medium text-gray-900">
                    {post.category.name}
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
                    {post.tags.map((tagRelation) => (
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
