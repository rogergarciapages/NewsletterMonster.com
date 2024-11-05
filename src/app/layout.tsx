// src/app/layout.tsx
import type { Metadata } from "next";

import AppNavbar from "./components/app-navbar";
import Footer from "./components/footer";
import Providers from "./components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Starter App",
  description: "A basic starter for next.js",
  icons: {
    // Standard favicons
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    // Apple Touch Icon
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    // Android Chrome Icons
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  // Add manifest for PWA support
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className="flex min-h-screen flex-col bg-background font-sans antialiased">
        <Providers>
          <div className="sticky top-0 z-50">
            <AppNavbar />
          </div>
          <div className="flex min-h-[calc(100vh-64px)] flex-grow flex-col">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
