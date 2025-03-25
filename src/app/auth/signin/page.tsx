"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import Header from "~/app/_components/header";
import Footer from "~/app/_components/footer";
import { api } from "~/trpc/react";
import Link from "next/link";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");
  const inviteCode = searchParams.get("inviteCode");
  const [inviteCodeInput, setInviteCodeInput] = useState(inviteCode ?? "");
  const [inviteStatus, setInviteStatus] = useState<
    "pending" | "valid" | "invalid" | "limit-reached" | null
  >(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);

  // Validate invite code if one is provided in the URL
  const {
    data: inviteValidation,
    isLoading: isValidating,
    isError,
  } = api.auth.validateInviteCode.useQuery(
    { code: inviteCodeInput },
    {
      enabled: inviteCodeInput.length > 0,
      refetchOnWindowFocus: false,
    },
  );

  // Update status when validation result changes
  useEffect(() => {
    if (!inviteCodeInput) {
      setInviteStatus(null);
      return;
    }

    if (isValidating) {
      setInviteStatus("pending");
      return;
    }

    if (isError) {
      setInviteStatus("invalid");
      return;
    }

    if (inviteValidation) {
      if (inviteValidation.valid) {
        setInviteStatus("valid");
      } else if (inviteValidation.reason === "LIMIT_REACHED") {
        setInviteStatus("limit-reached");
      } else {
        setInviteStatus("invalid");
      }
    }
  }, [inviteValidation, isValidating, isError, inviteCodeInput]);

  const handleSignIn = () => {
    // Reset any previous errors
    setTermsError(null);

    // İşlem için kullanıcının kuralları kabul etmesi gerekiyor
    if (!acceptTerms) {
      setTermsError(
        "Lütfen topluluk kurallarını ve gizlilik politikasını kabul edin.",
      );
      return;
    }

    // Store invite code to be accessible during auth flow
    if (inviteCodeInput) {
      // Store in sessionStorage for client-side access
      sessionStorage.setItem("inviteCode", inviteCodeInput);

      // Set a cookie that can be read server-side during auth
      document.cookie = `next-auth.invite-code=${inviteCodeInput}; path=/; max-age=3600; SameSite=Lax`;
    }

    void signIn("google", {
      callbackUrl,
      // Pass directly in query parameters as well
      inviteCode: inviteCodeInput,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow">
            <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
              Giriş Yap
            </h1>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                {error === "AccessDenied" && "Bu hesap ile giriş yapamazsınız."}
                {error === "Configuration" && "Sunucu yapılandırma hatası."}
                {error === "Verification" && "Doğrulama hatası."}
                {error === "Default" && "Giriş yapılırken bir hata oluştu."}
                {error === "invite-required" &&
                  "Kayıt olmak için davet kodu gereklidir."}
                {error === "invalid-invite" && "Geçersiz davet kodu."}
                {error === "invite-limit-reached" &&
                  "Bu davet kodu ile daha fazla kayıt yapılamaz."}
              </div>
            )}

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Davet Kodu
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value)}
                  placeholder="Kayıt olmak için davet kodu giriniz"
                  className={`w-full rounded-lg border p-3 shadow-sm focus:ring-1 focus:outline-none ${
                    inviteStatus === "valid"
                      ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                      : inviteStatus === "invalid" ||
                          inviteStatus === "limit-reached"
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                {inviteStatus === "pending" && (
                  <div className="absolute top-1/2 right-3 -translate-y-1/2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
                  </div>
                )}
                {inviteStatus === "valid" && (
                  <div className="absolute top-1/2 right-3 -translate-y-1/2 text-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                {(inviteStatus === "invalid" ||
                  inviteStatus === "limit-reached") && (
                  <div className="absolute top-1/2 right-3 -translate-y-1/2 text-red-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {inviteStatus === "invalid" && (
                <p className="mt-1 text-xs text-red-600">
                  Geçersiz davet kodu. Lütfen doğru kodu girdiğinizden emin
                  olun.
                </p>
              )}
              {inviteStatus === "limit-reached" && (
                <p className="mt-1 text-xs text-red-600">
                  Bu davet kodu ile yapılabilecek kayıt sayısı limitine
                  ulaşılmış.
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Davet kodu olmadan yeni kayıt yapılamaz. Mevcut kullanıcılar
                giriş yapabilir.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      if (e.target.checked) setTermsError(null);
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-700">
                    <Link
                      href="/kurallar"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Topluluk Kuralları
                    </Link>{" "}
                    ve{" "}
                    <Link
                      href="/gizlilik"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Gizlilik Politikası
                    </Link>
                    &apos;nı okudum ve kabul ediyorum.
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Bu platform tamamen halkımıza yardım etmek amacıyla
                    oluşturulmuştur. Platform üzerinden gerçekleştirilen tüm
                    etkileşimler kullanıcıların kendi sorumluluğundadır.
                  </p>
                  {termsError && (
                    <p className="mt-1 text-xs text-red-600">{termsError}</p>
                  )}
                </div>
              </div>
            </div>

            <Button onClick={handleSignIn} className="w-full">
              Google ile Giriş Yap
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
