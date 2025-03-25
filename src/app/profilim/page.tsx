"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Header from "../_components/header";
import Footer from "../_components/footer";
import Link from "next/link";
import type { HelpStatus } from "@prisma/client";
import { useSession } from "next-auth/react";

type TabType = "needPosts" | "helpOffers" | "settings";

export default function ProfilePage() {
  const { isAuthenticated, isLoading, logout } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("needPosts");

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Get user profile data
  const { data: profile, isLoading: isLoadingProfile } =
    api.auth.getProfile.useQuery(undefined, {
      enabled: isAuthenticated,
      refetchOnWindowFocus: false,
    });

  // Get user's need posts
  const {
    data: needPosts,
    isLoading: isLoadingNeedPosts,
    refetch: refetchNeedPosts,
  } = api.needPost.getMyPosts.useQuery(undefined, {
    enabled: isAuthenticated && activeTab === "needPosts",
    refetchOnWindowFocus: false,
  });

  // Get user's help offers
  const { data: helpOffers, isLoading: isLoadingHelpOffers } =
    api.helpOffer.getMyOffers.useQuery(undefined, {
      enabled: isAuthenticated && activeTab === "helpOffers",
      refetchOnWindowFocus: false,
    });

  // Need post status update mutation
  const updateNeedPostStatus = api.needPost.updateStatus.useMutation({
    onSuccess: () => {
      // Refresh data after status update
      void refetchNeedPosts();
    },
  });

  // Logout function
  const handleLogout = () => {
    void logout();
  };

  const handleStatusChange = (postId: string, newStatus: string) => {
    updateNeedPostStatus.mutate({
      id: postId,
      status: newStatus as HelpStatus,
    });
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <div className="border-primary-500 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
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
        <div className="container mx-auto max-w-6xl px-4">
          {/* Profile Header */}
          <div className="mb-8 overflow-hidden rounded-lg bg-white p-6 shadow md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  {profile?.name
                    ? `${profile.name} ${profile.surname ?? ""}`
                    : "Hesabım"}
                </h1>
                <p className="mt-1 text-gray-600">{profile?.phone}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                Çıkış Yap
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex border-b border-gray-200">
            <button
              className={`-mb-px px-6 py-4 text-sm font-medium ${
                activeTab === "needPosts"
                  ? "border-primary-500 text-primary-600 border-b-2"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("needPosts")}
            >
              İhtiyaçlarım
            </button>
            <button
              className={`-mb-px px-6 py-4 text-sm font-medium ${
                activeTab === "helpOffers"
                  ? "border-primary-500 text-primary-600 border-b-2"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("helpOffers")}
            >
              Yardım Tekliflerim
            </button>
            <button
              className={`-mb-px px-6 py-4 text-sm font-medium ${
                activeTab === "settings"
                  ? "border-primary-500 text-primary-600 border-b-2"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              Hesap Ayarları
            </button>
          </div>

          {/* Tab Content */}
          <div className="rounded-lg bg-white p-6 shadow md:p-8">
            {/* Need Posts Tab */}
            {activeTab === "needPosts" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    İhtiyaç İlanlarım
                  </h2>
                  <Link
                    href="/ihtiyacim-var"
                    className="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 text-sm font-medium text-white"
                  >
                    Yeni İhtiyaç İlanı
                  </Link>
                </div>

                {isLoadingNeedPosts ? (
                  <div className="flex justify-center py-12">
                    <div className="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                  </div>
                ) : needPosts && needPosts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Başlık
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Tarih
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Durum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Teklifler
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {needPosts.map((post) => (
                          <tr key={post.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                <Link
                                  href={`/ilanlar/ihtiyac/${post.id}`}
                                  className="hover:text-primary-600 hover:underline"
                                >
                                  {post.title}
                                </Link>
                              </div>
                              <div className="text-sm text-gray-500">
                                {post.category.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                              {formatDate(post.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={post.status}
                                onChange={(e) =>
                                  handleStatusChange(post.id, e.target.value)
                                }
                                className="rounded-md border border-gray-300 p-1 text-sm"
                              >
                                <option value="PENDING">Beklemede</option>
                                <option value="INPROGRESS">Devam Ediyor</option>
                                <option value="COMPLETED">Tamamlandı</option>
                                <option value="CANCELED">İptal Edildi</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                              {post._count.helpOffers} teklif
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                              <Link
                                href={`/ilanlar/ihtiyac/${post.id}`}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Görüntüle
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-500">
                      Henüz bir ihtiyaç ilanı oluşturmadınız.
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/ihtiyacim-var"
                        className="bg-primary-500 hover:bg-primary-600 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white"
                      >
                        İhtiyaç İlanı Oluştur
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Help Offers Tab */}
            {activeTab === "helpOffers" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Yardım Tekliflerim
                  </h2>
                  <Link
                    href="/yardim-edebilirim"
                    className="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 text-sm font-medium text-white"
                  >
                    Yeni Yardım Teklifi
                  </Link>
                </div>

                {isLoadingHelpOffers ? (
                  <div className="flex justify-center py-12">
                    <div className="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                  </div>
                ) : helpOffers && helpOffers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            İlan
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Tarih
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Durum
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {helpOffers.map((offer) => (
                          <tr key={offer.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                <Link
                                  href={`/ilanlar/ihtiyac/${offer.needPost.id}`}
                                  className="hover:text-primary-600 hover:underline"
                                >
                                  {offer.needPost.title}
                                </Link>
                              </div>
                              <div className="text-sm text-gray-500">
                                {offer.needPost.category.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                              {formatDate(offer.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                  offer.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : offer.status === "INPROGRESS"
                                      ? "bg-blue-100 text-blue-800"
                                      : offer.status === "COMPLETED"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                              >
                                {offer.status === "PENDING"
                                  ? "Beklemede"
                                  : offer.status === "INPROGRESS"
                                    ? "Devam Ediyor"
                                    : offer.status === "COMPLETED"
                                      ? "Tamamlandı"
                                      : "İptal Edildi"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                              <Link
                                href={`/ilanlar/ihtiyac/${offer.needPost.id}`}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Görüntüle
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-500">
                      Henüz bir yardım teklifi oluşturmadınız.
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/yardim-edebilirim"
                        className="bg-primary-500 hover:bg-primary-600 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white"
                      >
                        Yardım Teklifi Oluştur
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Hesap Ayarları
                </h2>
                <div className="py-4">
                  <div className="mb-6 rounded-md bg-yellow-50 p-4">
                    <p className="text-sm text-yellow-800">
                      Hesap ayarları yakında kullanıma açılacaktır.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Telefon Numarası
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          disabled
                          value={profile?.phone ?? ""}
                          className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 bg-gray-100 p-2 shadow-sm sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Eposta Adresi
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          disabled
                          value={profile?.email ?? ""}
                          className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 bg-gray-100 p-2 shadow-sm sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
