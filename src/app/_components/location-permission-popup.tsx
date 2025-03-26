"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import HowItWorksModal from "./how-it-works-modal";
import { FaInfoCircle } from "react-icons/fa";

interface LocationPermissionPopupProps {
  onPermissionGranted: () => void;
}

export default function LocationPermissionPopup({
  onPermissionGranted,
}: LocationPermissionPopupProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [permissionState, setPermissionState] = useState<
    "prompt" | "denied" | "granted"
  >("prompt");
  const [isLoading, setIsLoading] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  useEffect(() => {
    if (navigator.geolocation && "permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          setPermissionState(
            permissionStatus.state as "prompt" | "denied" | "granted",
          );

          if (permissionStatus.state === "granted") {
            onPermissionGranted();
            setIsOpen(false);
          }

          permissionStatus.onchange = () => {
            setPermissionState(
              permissionStatus.state as "prompt" | "denied" | "granted",
            );
            if (permissionStatus.state === "granted") {
              onPermissionGranted();
              setIsOpen(false);
            }
          };
        })
        .catch((error) => {
          console.error("Error querying geolocation permission:", error);
          setPermissionState("prompt");
        });
    }
  }, [onPermissionGranted]);

  const requestLocation = () => {
    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (_position) => {
        setPermissionState("granted");
        setIsLoading(false);
        onPermissionGranted();
        setIsOpen(false);
      },
      (error) => {
        setPermissionState("denied");
        setIsLoading(false);
        console.error("Error getting location:", error.message);
      },
    );
  };

  const renderInstructions = () => {
    switch (permissionState) {
      case "prompt":
        return (
          <>
            <p className="mb-2">
              Elver, size yakın çevrenizdeki yardım taleplerini gösterebilmek
              için konum bilginize ihtiyaç duymaktadır.
            </p>
            <p className="mb-4">
              Konum bilginiz sadece yakınınızdaki yardım taleplerini filtrelemek
              için kullanılacak ve başka bir amaçla paylaşılmayacaktır.
            </p>
            <button
              onClick={() => setShowHowItWorks(true)}
              className="mb-2 flex items-center gap-1 text-blue-600 hover:underline"
            >
              <FaInfoCircle className="h-4 w-4" />
              <span>Platform nasıl çalışır?</span>
            </button>
          </>
        );
      case "denied":
        return (
          <>
            <p className="mb-2 text-red-600">
              Konum izni reddedildi. Elver&apos;i kullanabilmek için konum izni
              vermeniz gerekmektedir.
            </p>
            <p className="mb-2">
              Konum izni vermek için tarayıcınızın adres çubuğundaki kilit veya
              bilgi simgesine tıklayıp, konum iznini &quot;İzin Ver&quot; olarak
              değiştirebilirsiniz.
            </p>
            <p className="mb-4">
              Ardından sayfayı yenileyerek Elver&apos;i kullanmaya
              başlayabilirsiniz.
            </p>
            <button
              onClick={() => setShowHowItWorks(true)}
              className="mb-2 flex items-center gap-1 text-blue-600 hover:underline"
            >
              <FaInfoCircle className="h-4 w-4" />
              <span>Platform nasıl çalışır?</span>
            </button>
          </>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-primary-800 text-xl font-bold">
              Konum İzni Gerekli
            </h2>
            {permissionState === "granted" && (
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>

          <div className="text-secondary-700 my-6">{renderInstructions()}</div>

          {permissionState === "prompt" && (
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={requestLocation}
                disabled={isLoading}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 rounded-md px-4 py-2 font-medium text-white transition-colors"
              >
                {isLoading ? "İşleniyor..." : "Konum İznine İzin Ver"}
              </button>
            </div>
          )}

          {permissionState === "denied" && (
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => window.location.reload()}
                className="bg-primary-600 hover:bg-primary-700 rounded-md px-4 py-2 font-medium text-white transition-colors"
              >
                Sayfayı Yenile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Nasıl Çalışır Modalı */}
      <HowItWorksModal
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
      />
    </>
  );
}
