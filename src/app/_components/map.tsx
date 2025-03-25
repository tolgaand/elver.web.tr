"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Tip tanımı
interface DefaultIconPrototype extends L.Icon.Default {
  _getIconUrl?: string;
}

// En basit çözüm: CDN üzerinden doğrudan hazır iconları kullan
const fixIcons = () => {
  delete (L.Icon.Default.prototype as DefaultIconPrototype)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
};

interface MapProps {
  lat: number;
  lng: number;
  zoom?: number;
  height?: string;
}

export default function Map({
  lat,
  lng,
  zoom = 14,
  height = "400px",
}: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fixIcons();
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex w-full items-center justify-center bg-gray-100"
        style={{ height, minHeight: "250px" }}
      >
        <p className="text-gray-500">Harita yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height, minHeight: "250px" }}>
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>Bu konumda yardıma ihtiyaç var</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
