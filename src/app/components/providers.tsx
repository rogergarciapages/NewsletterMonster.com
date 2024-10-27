"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  const navigate = (path: string) => {
    router.push(path as never);
  };

  return (
    <SessionProvider>
      <NextUIProvider
        navigate={navigate}
        className="flex h-full w-full flex-col"
      >
        <NextThemesProvider attribute="class">
          {children}
          <Toaster position="bottom-right" richColors />
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}