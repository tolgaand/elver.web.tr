"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, differenceInMilliseconds } from "date-fns";
import { tr } from "date-fns/locale";
import { api } from "~/trpc/react";

export default function RecentNeedsTable() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [now, setNow] = useState(new Date());

  const { data: needPosts, refetch } = api.needPost.getActiveNeeds.useQuery(
    undefined,
    {
      enabled: true,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    const interval = setInterval(() => {
      void refetch();
      setNow(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    setIsClient(true);
    setNow(new Date());
  }, []);

  const handleViewDetails = (id: string) => {
    router.push(`/ilanlar/ihtiyac/${id}`);
  };

  const formatDate = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: tr,
      });
    } catch {
      return "Bilinmiyor";
    }
  };

  const calculateRemainingTimePercentage = (
    createdAt: Date,
    expiresAt: Date | null,
  ) => {
    if (!expiresAt) return 0;

    try {
      const created = new Date(createdAt);
      const expires = new Date(expiresAt);
      const current = now;

      if (current > expires) return 100;

      const totalDuration = differenceInMilliseconds(expires, created);

      const elapsedTime = differenceInMilliseconds(current, created);

      const percentage = (elapsedTime / totalDuration) * 100;

      return Math.min(Math.max(percentage, 0), 100);
    } catch {
      return 0;
    }
  };

  const getTimeBarColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-orange-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (!isClient) {
    return (
      <div className="flex justify-center py-8">
        <div className="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="bg-primary-50 border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-medium text-gray-900">Son İhtiyaçlar</h3>
        <p className="mt-1 text-sm text-gray-500">
          Sistemde yeni eklenen ihtiyaç ilanları 10 saniyede bir güncellenir
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                İhtiyaç
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Tarih
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Kalan Süre
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {needPosts && needPosts.length > 0 ? (
              needPosts.slice(0, 5).map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {post.isUrgent && (
                        <span className="mr-2 flex h-2 w-2">
                          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                        </span>
                      )}
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {post.category?.name || "Diğer"}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                        post.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : post.status === "INPROGRESS"
                            ? "bg-blue-100 text-blue-800"
                            : post.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {post.status === "PENDING"
                        ? "Beklemede"
                        : post.status === "INPROGRESS"
                          ? "Devam Ediyor"
                          : post.status === "COMPLETED"
                            ? "Tamamlandı"
                            : "İptal Edildi"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {post.expiresAt ? (
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(post.expiresAt), {
                              addSuffix: true,
                              locale: tr,
                            })}
                          </div>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-gray-200">
                          {/* İlerleme çubuğu */}
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
                    ) : (
                      <span className="text-xs text-gray-500">Süresiz</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(post.id)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Detaylar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  Aktif ihtiyaç ilanı bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
