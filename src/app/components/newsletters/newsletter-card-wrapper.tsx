"use client";

import { useEffect, useState } from "react";

import type { Newsletter } from "@/types/newsletter";

import { NewsletterCardSkeleton } from "../skeleton/newsletter-card-skeleton";
import { NewsletterCard } from "./newsletter-card";

export default function NewsletterCardWrapper({ newsletter }: { newsletter: Newsletter }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <NewsletterCardSkeleton />;
  }

  return <NewsletterCard newsletter={newsletter} />;
}
