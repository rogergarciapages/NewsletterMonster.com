// components/navigation/page-tracker.tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PageNavigationTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Store the current path before navigation
    sessionStorage.setItem("previousPath", pathname);
  }, [pathname]);

  return null;
}