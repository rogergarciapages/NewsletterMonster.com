"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, CardTitle } from "@/components/ui/card";
import { Newsletter } from "@/types/newsletter";
import { slugify } from "@/utils/slugify";

interface NewsletterGridProps {
  newsletters: Newsletter[];
  observerRef?: (node: HTMLDivElement | null) => void;
}

export function NewsletterGrid({ newsletters, observerRef }: NewsletterGridProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsletters.map((_, index) => (
          <div key={index} className="relative aspect-[3/4] w-full bg-gray-100 dark:bg-gray-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Function to format date
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  // Default image for newsletters without a screenshot
  const defaultImage = "/images/newsletter-placeholder.jpg";

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {newsletters.map((newsletter, index) => {
        const isLastItem = index === newsletters.length - 1;

        return (
          <div key={newsletter.newsletter_id} ref={isLastItem ? observerRef : undefined}>
            <Card
              className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-white/5 transition-all duration-300 hover:scale-[1.02]"
              onClick={() =>
                router.push(
                  `/brand/${newsletter.Brand?.slug || slugify(newsletter.sender || "")}/${newsletter.newsletter_id}`
                )
              }
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-torch-900 to-torch-800 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.995]" />

              {/* Aspect ratio container */}
              <div className="relative w-full pt-[132.35%]">
                <div className="absolute inset-0 overflow-hidden">
                  {newsletter.top_screenshot_url ? (
                    <div className="relative h-full w-full">
                      <img
                        src={newsletter.top_screenshot_url}
                        alt={newsletter.subject || "Newsletter preview"}
                        className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-5"
                        onError={e => {
                          e.currentTarget.src = defaultImage;
                          e.currentTarget.onerror = null;
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-full w-full bg-gradient-to-b from-gray-800/90 to-gray-900/90 group-hover:from-gray-800/30 group-hover:to-gray-900/30" />
                  )}
                </div>

                {/* Content overlay */}
                <div className="absolute inset-0 z-10 flex flex-col justify-between">
                  {/* Title area */}
                  <div className="space-y-2 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <CardTitle className="line-clamp-4 text-xl leading-tight tracking-tight text-white">
                      {newsletter.subject || "No Subject"}
                    </CardTitle>

                    {newsletter.created_at && (
                      <div className="text-xs text-gray-300/90 group-hover:text-gray-200/60">
                        {formatDate(newsletter.created_at)}
                      </div>
                    )}
                  </div>

                  {/* Footer with permanent glassy effect */}
                  <div className="space-y-4 bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 group-hover:bg-transparent">
                    <div className="flex items-center space-x-4">
                      {typeof newsletter.likes_count === "number" && (
                        <div className="flex items-center space-x-2 rounded-full bg-black/70 px-3 py-1.5 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/20">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="currentColor"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <span className="text-xs font-medium">{newsletter.likes_count}</span>
                        </div>
                      )}
                      {typeof newsletter.you_rocks_count === "number" && (
                        <div className="flex items-center space-x-2 rounded-full bg-black/70 px-3 py-1.5 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-black/20">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            strokeWidth="1.5"
                            stroke="currentColor"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M11 11.5v-1a1.5 1.5 0 0 1 3 0v1.5" />
                            <path d="M17 12v-6.5a1.5 1.5 0 0 1 3 0v10.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" />
                            <path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5" />
                            <path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5" />
                          </svg>
                          <span className="text-xs font-medium">{newsletter.you_rocks_count}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="inline-block overflow-hidden truncate rounded-full bg-emerald-600/90 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-300 hover:bg-emerald-500/90 group-hover:bg-emerald-600/60 group-hover:hover:bg-emerald-500/60">
                        {newsletter.Brand?.name || newsletter.sender || "Unknown Sender"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
