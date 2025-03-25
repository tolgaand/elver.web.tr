import "~/styles/globals.css";

import { Georama } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import LocationPermissionWrapper from "./_components/location-permission-wrapper";
import { SessionProvider } from "next-auth/react";
import AuthConsumer from "./_components/auth-consumer";

const georama = Georama({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata = {
  title: "Elver: Topluluk Dayanışma Ağı",
  description:
    "Halk tarafından halk için oluşturulmuş topluluk dayanışma platformu. İhtiyaç sahipleriyle yardım edebilecek kişileri buluşturuyoruz.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`font-sans ${georama.variable}`}>
        <TRPCReactProvider>
          <SessionProvider>
            <LocationPermissionWrapper>
              <AuthConsumer>{children}</AuthConsumer>
            </LocationPermissionWrapper>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
