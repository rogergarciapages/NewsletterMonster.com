"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Card as NextUICard, Skeleton } from "@nextui-org/react";
import axios from "axios";

import HeartFullIcon from "@/assets/svg/Heartfull.svg";
import YouRockIcon from "@/assets/svg/Yourockicon.svg";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { slugify } from "@/utils/slugify";

import { Newsletter } from "../brand/newsletter/types";

// Skeleton component for Popular Newsletters
const PopularNewsletterSkeleton = () => {
  return (
    <NextUICard className="relative h-[400px] p-3">
      {" "}
      {/* Adjusted height for 4-column layout */}
      <Skeleton className="h-[330px] w-full rounded-xl" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    </NextUICard>
  );
};

export const PopularNewsletters = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPopularNewsletters = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/newsletters/popular");
        setNewsletters(response.data);
      } catch (error) {
        console.error("Error fetching popular newsletters:", error);
        setError("Failed to load popular newsletters");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularNewsletters();
  }, []);

  const handleCardClick = (newsletter: Newsletter) => {
    router.push(`/${slugify(newsletter.sender || "")}/${newsletter.newsletter_id}`);
  };

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-5xl font-bold tracking-tight">Popular Newsletters</h2>
        <p className="text-gray-[#111] mx-auto mb-16 max-w-2xl text-lg leading-tight tracking-tight dark:text-white">
          Discover most engaging newsletters, curated based on reader engagement and appreciation.
          These top picks showcase the best content from our community, featuring insights,
          analysis, and unique perspectives.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <PopularNewsletterSkeleton key={`skeleton-${index}`} />
            ))
          : newsletters.map(newsletter => (
              <Card
                key={newsletter.newsletter_id}
                className="group relative flex h-[450px] cursor-pointer flex-col text-white transition-transform duration-300 hover:scale-[1.02]"
                onClick={() => handleCardClick(newsletter)}
              >
                <div
                  className="relative flex h-full flex-grow flex-col justify-between rounded-xl p-2"
                  style={{
                    backgroundImage: `url(${newsletter.top_screenshot_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    margin: "12px",
                  }}
                >
                  <div className="absolute inset-0 rounded-lg bg-torch-700 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-85" />

                  <CardContent className="relative z-10">
                    {/* Future content placeholder */}
                  </CardContent>

                  <CardFooter className="relative z-10 flex w-full flex-col items-start">
                    <CardTitle className="strong mb-4 text-pretty text-2xl leading-7 tracking-tight text-[#ccc] opacity-0 transition-opacity duration-300 hover:text-white group-hover:opacity-100">
                      {newsletter.subject || "No Subject"}
                    </CardTitle>

                    <div className="flex w-full flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="flex items-center space-x-3">
                        {newsletter.likes_count !== null && (
                          <div className="flex items-center space-x-1 rounded-full bg-black/70 px-2 py-1 text-white backdrop-blur-sm">
                            <HeartFullIcon className="h-4 w-4" />
                            <span className="text-sm">{newsletter.likes_count}</span>
                          </div>
                        )}
                        {newsletter.you_rocks_count !== null && (
                          <div className="flex items-center space-x-1 rounded-full bg-black/70 px-2 py-1 text-white backdrop-blur-sm">
                            <YouRockIcon className="h-4 w-4" />
                            <span className="text-sm">{newsletter.you_rocks_count}</span>
                          </div>
                        )}
                      </div>

                      <div
                        onClick={e => {
                          e.stopPropagation();
                          router.push(`/${slugify(newsletter.sender || "")}`);
                        }}
                        className="transition-transform duration-300 hover:scale-105"
                      >
                        <CardDescription className="inline-block truncate rounded-full bg-aquamarine-700 px-2 py-1 text-xs text-white hover:bg-aquamarine-600">
                          {newsletter.sender || "Unknown Sender"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardFooter>
                </div>
              </Card>
            ))}
      </div>
    </section>
  );
};
