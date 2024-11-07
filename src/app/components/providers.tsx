// src/app/components/providers.tsx
"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ParallaxProvider } from "react-scroll-parallax";
import { Toaster } from "sonner";

// src/app/components/providers.tsx

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Fix the navigation type issue
  const navigate = (href: string) => {
    router.push(href as never); // Type assertion needed for Next.js App Router
  };

  return (
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
  );
}
