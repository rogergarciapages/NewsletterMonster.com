// C:\Users\Usuario\Documents\GitHub\nm4\src\app\components\providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Option 1: Type assertion
  const navigate = (path: string) => {
    router.push(path as never);
  };


  return (
    <SessionProvider>
      <NextUIProvider navigate={navigate}>
        <NextThemesProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
          storageKey="newsletter-monster-theme"
        >
          <div className="flex min-h-screen w-full flex-col">
            {children}
          </div>
          <Toaster position="bottom-right" richColors />
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}