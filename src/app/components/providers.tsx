/* eslint-disable quotes */
"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ParallaxProvider } from "react-scroll-parallax";
import { Toaster } from "sonner";
import { SWRConfig } from "swr";

/* eslint-disable quotes */

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`An error occurred while fetching the data.`);
  }
  return response.json();
};

export default function Providers({ children }: { children: ReactNode }) {
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
