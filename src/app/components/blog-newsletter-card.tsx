"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { Newsletter } from "@/types/newsletter";
import { slugify } from "@/utils/slugify";

interface BlogNewsletterCardProps {
  newsletter: Newsletter;
}

export function BlogNewsletterCard({ newsletter }: BlogNewsletterCardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCardClick = () => {
    router.push(`/brand/${slugify(newsletter.sender || "")}/${newsletter.newsletter_id}`);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  const defaultImage = "/images/newsletter-placeholder.jpg";

  if (!mounted) {
    return (
      <div className="aspect-[3/4] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
    );
  }

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-white/5 transition-all duration-300 hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      {/* Aspect ratio container */}
      <div className="relative w-full pt-[132.35%]">
        {/* Base image - important: no wrapper divs between this and the parent */}
        <Image
          src={newsletter.top_screenshot_url || defaultImage}
          alt={newsletter.subject || "Newsletter preview"}
          fill
          className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-5"
          priority={true}
          onError={() => setImageError(true)}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-torch-900 to-torch-800 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.995]"></div>

        {/* Content exactly matching the provided HTML */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between">
          <div className="space-y-2 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <h3 className="line-clamp-4 text-xl font-semibold leading-tight tracking-tight text-white">
              {newsletter.subject || "No Subject"}
            </h3>
            {newsletter.created_at && (
              <div className="text-xs text-gray-300/90 group-hover:text-gray-200/60">
                {formatDate(newsletter.created_at)}
              </div>
            )}
          </div>
          <div className="space-y-4 bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 group-hover:bg-transparent">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 rounded-full bg-black/70 px-3 py-1.5 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/20">
                <svg fill="currentColor" className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037.033.034-.03a6 6 0 0 1 4.733-1.44l.246.036a6 6 0 0 1 3.364 10.008l-.18.185-.048.041-7.45 7.379a1 1 0 0 1-1.313.082l-.094-.082-7.493-7.422A6 6 0 0 1 6.979 3.074"></path>
                </svg>
                <span className="text-xs font-medium">{newsletter.likes_count || 0}</span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-black/70 px-3 py-1.5 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/20">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                >
                  <path stroke="none" d="M0 0h24v24H0z"></path>
                  <path d="M11 11.5v-1a1.5 1.5 0 0 1 3 0V12"></path>
                  <path d="M17 12V5.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-2 .208a6 6 0 0 1-5.012-2.7L7 19q-.468-.718-3.286-5.728a1.5 1.5 0 0 1 .536-2.022 1.87 1.87 0 0 1 2.28.28L8 13"></path>
                  <path d="M14 10.5a1.5 1.5 0 0 1 3 0V12M8 13V4.5a1.5 1.5 0 0 1 3 0V12"></path>
                </svg>
                <span className="text-xs font-medium">{newsletter.you_rocks_count || 0}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button className="transform-gpu transition-all duration-300 hover:scale-105">
                <span className="inline-block overflow-hidden truncate rounded-full bg-aquamarine-600/90 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-300 hover:bg-aquamarine-500/90 group-hover:bg-aquamarine-600/60 group-hover:hover:bg-aquamarine-500/60">
                  {newsletter.sender || "Unknown Sender"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
