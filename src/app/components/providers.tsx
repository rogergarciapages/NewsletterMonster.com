/* eslint-disable quotes */
"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import { NextUIProvider } from "@nextui-org/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ParallaxProvider } from "react-scroll-parallax";
import { Toaster } from "sonner";
import { SWRConfig } from "swr";

/* eslint-disable quotes */

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error(`An error occurred while fetching the data.`);
    const info = await response.json().catch(() => ({}));
    (error as Error & { status?: number; info?: unknown }).status = response.status;
    (error as Error & { status?: number; info?: unknown }).info = info;
    throw error;
  }
  return response.json();
};

interface ProvidersProps {
  children: ReactNode;
  _session?: Session | null;
}

export default function Providers({ children, _session }: ProvidersProps) {
  const router = useRouter();

  const navigate = (href: string) => {
    router.push(href as never);
  };

  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      <SessionProvider>
        <NextUIProvider navigate={navigate}>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="newsletter-monster-theme"
          >
            <ParallaxProvider>
              <div className="flex min-h-screen w-full flex-col">{children}</div>
            </ParallaxProvider>
            <Toaster position="bottom-right" richColors closeButton expand visibleToasts={6} />
          </NextThemesProvider>
        </NextUIProvider>
      </SessionProvider>
    </SWRConfig>
  );
}
