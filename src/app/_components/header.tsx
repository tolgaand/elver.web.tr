"use client";

import Link from "next/link";
import { FaHandFist, FaLightbulb } from "react-icons/fa6";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AuthModal from "./auth-modal";
import FeedbackPopup from "./feedback-popup";
import { useState } from "react";

export default function Header() {
  const { status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex-1">
          <Link
            href="/"
            className="flex items-center text-2xl font-bold tracking-tight text-gray-900"
          >
            <FaHandFist className="text-primary-600 mr-2 h-6 w-6" />
            elver
          </Link>
        </div>
        <div className="hidden gap-6 md:flex">
          <Link
            href="/ihtiyacim-var"
            className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
          >
            İhtiyaç Bildir
          </Link>
        </div>
        {status === "unauthenticated" && (
          <>
            <Button onClick={() => setShowAuthModal(true)}>Giriş Yap</Button>
            <AuthModal
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
            />
          </>
        )}
        {status === "authenticated" && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFeedbackPopup(true)}
              className="flex items-center rounded-full bg-yellow-100 p-2 text-yellow-600 hover:bg-yellow-200"
              title="Öneri ve Geri Bildirim"
            >
              <FaLightbulb className="h-5 w-5" />
            </button>
            <Button onClick={() => router.push("/profilim")}>Profilim</Button>
            <FeedbackPopup
              isOpen={showFeedbackPopup}
              onClose={() => setShowFeedbackPopup(false)}
            />
          </div>
        )}
      </div>
    </header>
  );
}
