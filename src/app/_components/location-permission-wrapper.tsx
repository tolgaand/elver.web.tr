"use client";

import { useState, useEffect, useRef } from "react";
import LocationPermissionPopup from "./location-permission-popup";

interface LocationPermissionWrapperProps {
  children: React.ReactNode;
}

export default function LocationPermissionWrapper({
  children,
}: LocationPermissionWrapperProps) {
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (newPosition) => {
        setPosition(newPosition);
        console.log("Current location:", {
          lat: newPosition.coords.latitude,
          lng: newPosition.coords.longitude,
          accuracy: newPosition.coords.accuracy,
          timestamp: new Date(newPosition.timestamp).toLocaleTimeString(),
        });
      },
      (error) => {
        console.error("Error updating location:", error.message);
      },
    );
  };

  useEffect(() => {
    if (locationPermissionGranted) {
      updateLocation();

      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }

      intervalIdRef.current = setInterval(() => {
        console.log("10 second interval executed");
        updateLocation();
      }, 10000);

      return () => {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
      };
    }
  }, [locationPermissionGranted]);

  useEffect(() => {
    // Tarayıcı tarafında çalıştığımızdan emin ol
    if (typeof window !== "undefined" && navigator.geolocation) {
      // Konum izninin durumunu kontrol et
      if ("permissions" in navigator) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((permissionStatus) => {
            if (permissionStatus.state === "granted") {
              setLocationPermissionGranted(true);
            }
            setLoading(false);
          })
          .catch(() => {
            // Permissions API desteklenmiyorsa kullanıcıdan manuel olarak izin iste
            setLoading(false);
          });
      } else {
        // Permissions API desteklenmiyorsa doğrudan getCurrentPosition'ı çağırarak izin kontrolü yap
        setLoading(false);
      }
    } else {
      // Tarayıcı geolocation desteklemiyorsa
      setLoading(false);
      setLocationPermissionGranted(true); // Geolocation desteklenmeyen ortamlarda sayfayı göster
    }
  }, []);

  const handlePermissionGranted = () => {
    setLocationPermissionGranted(true);
  };

  if (loading) {
    // Sayfa yüklenirken boş bir yükleme ekranı göster
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary-200 border-t-primary-600 h-12 w-12 animate-spin rounded-full border-4"></div>
      </div>
    );
  }

  return (
    <>
      {!locationPermissionGranted && (
        <LocationPermissionPopup
          onPermissionGranted={handlePermissionGranted}
        />
      )}
      <div
        className={
          !locationPermissionGranted ? "pointer-events-none blur-sm" : ""
        }
      >
        {children}
      </div>
    </>
  );
}
