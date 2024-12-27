// src/app/layout.tsx
import type { Metadata, Viewport } from "next";

import { Toaster } from "sonner";

import AppNavbar from "@/app/components/app-navbar";
import Footer from "@/app/components/footer";
import Providers from "@/app/components/providers";
import { initCronJobs } from "@/lib/cron";

import "./globals.css";

// Initialize cron jobs in development
if (process.env.NODE_ENV === "development") {
  initCronJobs();
}

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://newslettermonster.com");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#d7002e",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "NewsletterMonster - Track and Discover the Best Email Newsletters",
  description:
    "Find, track and discover the best email newsletters all in one place. Join our community of newsletter enthusiasts.",
  keywords:
    "newsletters, email newsletters, newsletter directory, newsletter tracking, newsletter discovery",
  authors: [{ name: "NewsletterMonster" }],
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
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
  manifest: "/site.webmanifest",
  // Open Graph / Social Media
  openGraph: {
    type: "website",
    siteName: "NewsletterMonster",
    title: "NewsletterMonster - Track and Discover the Best Email Newsletters",
    description: "Find, track and discover the best email newsletters all in one place",
    images: [
      {
        url: "/social-share-image.png",
        width: 1200,
        height: 630,
        alt: "NewsletterMonster - Newsletter Discovery Platform",
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "NewsletterMonster",
    description: "Find, track and discover the best email newsletters",
    images: ["/social-share-image.png"],
  },
  alternates: {
    canonical: baseUrl,
  },
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
          <AppNavbar />
          <main>
            <div className="flex min-h-[calc(100vh-64px)] flex-grow flex-col">{children}</div>
          </main>
          <Footer />
          <Toaster position="bottom-right" richColors closeButton expand visibleToasts={6} />
        </Providers>
      </body>
    </html>
  );
}
