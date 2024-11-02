// src/app/components/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Fix the navigation type issue
  const navigate = (href: string) => {
    router.push(href as never);  // Type assertion needed for Next.js App Router
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
          <div className="flex min-h-screen w-full flex-col">
            {children}
          </div>
          <Toaster 
            position="bottom-right" 
            richColors 
            closeButton
            expand
            visibleToasts={6}
          />
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}