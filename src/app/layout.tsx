// src/app/layout.tsx
import { Inter } from "next/font/google";

import { getServerSession } from "next-auth";

import AppNavbar from "@/app/components/app-navbar";
import Providers from "@/app/components/providers";
import { authOptions } from "@/lib/auth";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Newsletter Manager",
  description: "Newsletter Manager",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning className={`light ${inter.className}`}>
      <body className="flex min-h-screen flex-col bg-background font-sans antialiased">
        <Providers _session={session}>
          <AppNavbar />
          <main>
            <div className="flex min-h-[calc(100vh-64px)] flex-grow flex-col">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
