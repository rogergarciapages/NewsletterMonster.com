// src/app/layout.tsx
import { Inter } from "next/font/google";
import Script from "next/script";

import { getServerSession } from "next-auth";

import AppNavbar from "@/app/components/app-navbar/index";
import AuthRedirect from "@/app/components/auth-redirect";
import Providers from "@/app/components/providers";
import { authOptions } from "@/lib/auth";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Newsletter Manager",
  description: "Newsletter Manager",
  verification: {
    google: "bvpPc-4eFCo7zYJyOwRQdv5q-qieCEXz-2cQXVHJxj4",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning className={`light ${inter.className}`}>
      <head>
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-3T0PVJVF3K" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3T0PVJVF3K');
          `}
        </Script>
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans antialiased">
        <Providers _session={session}>
          <AuthRedirect />
          <AppNavbar />
          <main>
            <div className="flex min-h-[calc(100vh-64px)] flex-grow flex-col">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
