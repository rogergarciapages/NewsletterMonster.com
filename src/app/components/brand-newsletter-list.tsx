// components/brand-newsletter-list.tsx
"use client";

import Link from "next/dist/client/link";

import { formatDistanceToNow } from "date-fns";

import HeartFullIcon from "@/assets/svg/Heartfull.svg";
import YouRockIcon from "@/assets/svg/Yourockicon.svg";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";

// components/brand-newsletter-list.tsx

// components/brand-newsletter-list.tsx

type BrandNewsletter = {
  newsletter_id: number;
  sender: string | null;
  subject: string | null;
  top_screenshot_url: string | null;
  likes_count: number | null;
  you_rocks_count: number | null;
  created_at: Date | null;
  summary: string | null;
};

interface BrandNewsletterListProps {
  newsletters: BrandNewsletter[];
  brandname: string;
}

export default function BrandNewsletterList({ newsletters, brandname }: BrandNewsletterListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {newsletters.map(newsletter => (
        <Card
          key={newsletter.newsletter_id}
          className="group relative flex min-h-[400px] flex-col transition-shadow duration-300 hover:shadow-lg"
        >
          <div
            className="relative flex flex-grow flex-col justify-between rounded-md p-4"
            style={{
              backgroundImage: `url(${newsletter.top_screenshot_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              margin: "15px",
            }}
          >
            <div className="absolute inset-0 bg-torch-700 opacity-0 transition-opacity duration-300 group-hover:opacity-85" />

            <CardContent className="relative z-10">
              {newsletter.created_at && (
                <div className="mb-2 text-sm text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {formatDistanceToNow(new Date(newsletter.created_at), { addSuffix: true })}
                </div>
              )}
            </CardContent>

            <CardFooter className="relative z-10 flex flex-col items-start">
              <Link href={`/brand/${brandname}/${newsletter.newsletter_id}`}>
                <CardTitle className="mb-4 text-2xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {newsletter.subject || "No Subject"}
                </CardTitle>
              </Link>

              <div className="flex items-center space-x-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {newsletter.likes_count !== null && (
                  <div className="flex items-center space-x-2 rounded-full bg-black px-3 py-1 text-white">
                    <HeartFullIcon className="h-4 w-4" />
                    <span>{newsletter.likes_count}</span>
                  </div>
                )}
                {newsletter.you_rocks_count !== null && (
                  <div className="flex items-center space-x-2 rounded-full bg-black px-3 py-1 text-white">
                    <YouRockIcon className="h-4 w-4" />
                    <span>{newsletter.you_rocks_count}</span>
                  </div>
                )}
              </div>

              {newsletter.summary && (
                <CardDescription className="mt-4 line-clamp-3 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {newsletter.summary}
                </CardDescription>
              )}
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  );
}
