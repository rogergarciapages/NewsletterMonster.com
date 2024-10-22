// components/brand-newsletter-list.tsx
"use client";

import HeartFullIcon from "@/assets/svg/Heartfull.svg";
import YouRockIcon from "@/assets/svg/Yourockicon.svg";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

type BrandNewsletter = {
  newsletter_id: number;
  sender: string | null;
  subject: string | null;
  top_screenshot_url: string | null;
  likes_count: number | null;
  you_rocks_count: number | null;
  created_at: Date | null;
  summary: string | null;
}

interface BrandNewsletterListProps {
  newsletters: BrandNewsletter[];
  brandname: string;
}

export default function BrandNewsletterList({ newsletters, brandname }: BrandNewsletterListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsletters.map((newsletter) => (
        <Card 
          key={newsletter.newsletter_id}
          className="relative min-h-[400px] flex flex-col group hover:shadow-lg transition-shadow duration-300"
        >
          <div
            className="relative p-4 rounded-xl flex-grow flex flex-col justify-between"
            style={{
              backgroundImage: `url(${newsletter.top_screenshot_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              margin: "15px",
            }}
          >
            <div className="absolute inset-0 bg-torch-700 opacity-0 group-hover:opacity-85 transition-opacity duration-300" />
            
            <CardContent className="relative z-10">
              {newsletter.created_at && (
                <div className="text-gray-400 text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {formatDistanceToNow(new Date(newsletter.created_at), { addSuffix: true })}
                </div>
              )}
            </CardContent>

            <CardFooter className="relative z-10 flex flex-col items-start">
              <Link href={`/${brandname}/${newsletter.newsletter_id}`}>
                <CardTitle className="text-white text-2xl mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {newsletter.subject || "No Subject"}
                </CardTitle>
              </Link>

              <div className="flex space-x-4 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {newsletter.likes_count !== null && (
                  <div className="flex items-center space-x-2 bg-black text-white rounded-full px-3 py-1">
                    <HeartFullIcon className="w-4 h-4" />
                    <span>{newsletter.likes_count}</span>
                  </div>
                )}
                {newsletter.you_rocks_count !== null && (
                  <div className="flex items-center space-x-2 bg-black text-white rounded-full px-3 py-1">
                    <YouRockIcon className="w-4 h-4" />
                    <span>{newsletter.you_rocks_count}</span>
                  </div>
                )}
              </div>

              {newsletter.summary && (
                <CardDescription className="text-white text-sm mt-4 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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