"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AuthModal from "./auth-modal";

const fixIcons = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
};

interface NeedMarker {
  id: string;
  title: string;
  lat: number;
  lng: number;
  isUrgent: boolean;
  category: { name: string } | null;
}

// Haritayı merkeze almak için basit bir komponent
function MapCenterController({ markers }: { markers: NeedMarker[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || markers.length === 0) return;

    // Haritayı uygun boyuta getir
    if (markers.length === 1) {
      const marker = markers[0];
      if (
        marker &&
        typeof marker.lat === "number" &&
        typeof marker.lng === "number"
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        map.setView([marker.lat, marker.lng], 12);
      }
    } else {
      try {
        const validMarkers = markers.filter(
          (m) => m && typeof m.lat === "number" && typeof m.lng === "number",
        );

        if (validMarkers.length > 0) {
          const points = validMarkers.map(
            (m) => [m.lat, m.lng] as [number, number],
          );
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          const bounds = L.latLngBounds(points);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (error) {
        console.error("Harita sınırlarını ayarlama hatası:", error);
      }
    }
  }, [markers, map]);

  return null;
}

export default function ActiveNeedsMap() {
  const { data: session, status } = useSession();
  const [markers, setMarkers] = useState<NeedMarker[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  // Aktif ihtiyaçları getir
  const { data: activeNeeds, refetch } = api.needPost.getActiveNeeds.useQuery(
    undefined,
    {
      enabled: status === "authenticated",
      refetchOnWindowFocus: false,
    },
  );

  // 10 saniyede bir yenile
  useEffect(() => {
    if (status === "authenticated") {
      const interval = setInterval(() => {
        void refetch();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [status, refetch]);

  // Client tarafında çalıştır ve iconları düzelt
  useEffect(() => {
    // Leaflet iconlarını düzelt
    fixIcons();
    setMounted(true);

    // Marker verilerini güncelle
    if (activeNeeds && Array.isArray(activeNeeds)) {
      const validNeeds = activeNeeds.filter(
        (need) =>
          need &&
          typeof need.locationLat === "number" &&
          typeof need.locationLng === "number",
      );

      const newMarkers = validNeeds.map((need) => ({
        id: need.id,
        title: need.title,
        lat: need.locationLat,
        lng: need.locationLng,
        isUrgent: !!need.isUrgent,
        category: need.category,
      }));

      setMarkers(newMarkers);
    }
  }, [activeNeeds]);

  if (status !== "authenticated") {
    return (
      <div className="rounded-lg bg-blue-50 p-6 text-center">
        <p className="mb-4 text-lg text-blue-700">
          Bu içeriği görebilmek için giriş yapmalısınız.
        </p>
        <p className="mb-4 text-sm text-orange-600">
          Konum verileri hassas bilgiler içerebilir. Topluluğumuzun güvenliği ve
          gizliliğini korumak amacıyla harita sadece kimlik doğrulaması yapılmış
          kullanıcılara gösterilmektedir.
        </p>
        <button
          onClick={() => setShowAuthModal(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          Giriş Yap
        </button>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center rounded-lg bg-gray-100">
        <p className="text-gray-500">Harita yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: "500px", minHeight: "400px" }}>
      {typeof window !== "undefined" && markers.length > 0 && (
        <MapContainer
          center={[39.925533, 32.866287]} // Türkiye merkezi
          zoom={6}
          style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Haritayı merkeze alacak komponent */}
          <MapCenterController markers={markers} />

          {markers.map((marker) => (
            <Marker key={marker.id} position={[marker.lat, marker.lng]}>
              <Popup>
                <div>
                  <h3 className="font-bold">{marker.title}</h3>
                  {marker.category && (
                    <p className="text-sm text-gray-600">
                      Kategori: {marker.category.name}
                    </p>
                  )}
                  <button
                    onClick={() => router.push(`/ilanlar/ihtiyac/${marker.id}`)}
                    className="mt-2 inline-block w-full rounded bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                  >
                    Detayları Görüntüle
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
