"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { signIn } from "next-auth/react";
import { X } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

interface AuthModalProps {
  callbackUrl?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  isOpen?: boolean;
}

export type AuthModalRef = {
  setOpen: (open: boolean) => void;
};

const AuthModal = forwardRef<AuthModalRef, AuthModalProps>(
  ({ callbackUrl = "/", children, onClose, isOpen = false }, ref) => {
    const [open, setOpen] = useState(isOpen);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Props değiştiğinde state'i güncelle
    if (isOpen !== open) {
      setOpen(isOpen);
    }

    useImperativeHandle(ref, () => ({
      setOpen,
    }));

    const handleSignIn = async (provider: string) => {
      try {
        setIsLoading(true);
        setError(null);
        await signIn(provider, { callbackUrl, redirect: true });
      } catch (err) {
        setError("Giriş sırasında bir hata oluştu.");
        console.error("Auth error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const handleClose = () => {
      setOpen(false);
      onClose?.();
    };

    if (!open) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Giriş Yap</h2>
            <button
              onClick={handleClose}
              className="rounded-full p-1 transition-colors hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <p className="mb-6 text-gray-600">
            Elver platformunda yardım etmek veya yardım istemek için giriş
            yapın.
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col space-y-3">
            <button
              onClick={() => handleSignIn("google")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50 disabled:opacity-70"
            >
              <FcGoogle className="h-5 w-5" />
              <span>{isLoading ? "İşleniyor..." : "Google ile Giriş Yap"}</span>
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            Giriş yaparak,{" "}
            <a href="/kurallar" className="text-primary underline">
              Topluluk Kurallarını
            </a>{" "}
            ve{" "}
            <a href="/gizlilik" className="text-primary underline">
              Gizlilik Politikasını
            </a>{" "}
            kabul etmiş olursunuz.
          </div>
        </div>
      </div>
    );
  },
);

AuthModal.displayName = "AuthModal";

export default AuthModal;
