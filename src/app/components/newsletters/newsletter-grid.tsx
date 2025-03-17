"use client";

import Link from "next/link";
import { useRef } from "react";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { format } from "date-fns";

import { Newsletter } from "@/types/newsletter";

interface NewsletterGridProps {
  newsletters: Newsletter[];
  observerRef?: (node: HTMLDivElement | null) => void;
}

export function NewsletterGrid({ newsletters, observerRef }: NewsletterGridProps) {
  const lastNewsletterRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {newsletters.map((newsletter, index) => {
        const isLastItem = index === newsletters.length - 1;

        return (
          <div
            key={newsletter.newsletter_id}
            ref={
              isLastItem
                ? node => {
                    lastNewsletterRef.current = node;
                    if (observerRef) observerRef(node);
                  }
                : undefined
            }
          >
            <Link
              href={`/brand/${newsletter.Brand?.slug}/${newsletter.newsletter_id}`}
              className="block h-full transition-transform duration-200 hover:scale-[1.02]"
            >
              <Card className="h-full overflow-hidden">
                {newsletter.top_screenshot_url && (
                  <CardHeader className="p-0">
                    <img
                      src={newsletter.top_screenshot_url}
                      alt={newsletter.subject || "Newsletter preview"}
                      className="h-48 w-full object-cover object-top"
                      loading="lazy"
                      onError={e => {
                        e.currentTarget.src = "/placeholder-image.jpg"; // Path to a fallback image
                        e.currentTarget.onerror = null; // Prevent infinite error loop
                      }}
                    />
                  </CardHeader>
                )}
                <CardBody className="flex flex-col gap-2 p-4">
                  <div className="text-sm font-semibold text-primary">
                    {newsletter.Brand?.name || newsletter.sender}
                  </div>
                  <h3 className="line-clamp-2 text-lg font-bold">
                    {newsletter.subject || "Untitled Newsletter"}
                  </h3>
                  {newsletter.summary && (
                    <p className="line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                      {newsletter.summary}
                    </p>
                  )}
                </CardBody>
                <CardFooter className="flex items-center justify-between border-t p-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>{newsletter.likes_count || 0} likes</span>
                    <span>•</span>
                    <span>{newsletter.you_rocks_count || 0} rocks</span>
                  </div>
                  <div>
                    {newsletter.created_at && (
                      <time dateTime={newsletter.created_at.toString()}>
                        {format(new Date(newsletter.created_at), "MMM d, yyyy")}
                      </time>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
