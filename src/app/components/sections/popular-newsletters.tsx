"use client";

import HeartFullIcon from "@/assets/svg/Heartfull.svg";
import YouRockIcon from "@/assets/svg/Yourockicon.svg";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { slugify } from "@/utils/slugify";
import { Card as NextUICard, Skeleton } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Newsletter } from "../brand/newsletter/types";

// Skeleton component for Popular Newsletters
const PopularNewsletterSkeleton = () => {
  return (
    <NextUICard className="relative h-[400px] p-3"> {/* Adjusted height for 4-column layout */}
      <Skeleton className="rounded-xl w-full h-[330px]" />
      <div className="mt-3 space-y-2">
        <Skeleton className="w-3/4 rounded-lg h-6" />
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Skeleton className="w-16 h-6 rounded-full" />
            <Skeleton className="w-16 h-6 rounded-full" />
          </div>
          <Skeleton className="w-24 h-6 rounded-full" />
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
    return (
      <div className="text-center text-red-500 py-8">{error}</div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold mb-3 tracking-tight">Popular Newsletters</h2>
        <p className="text-gray-[#111] tracking-tight dark:text-white max-w-2xl mx-auto text-lg leading-tight mb-16">
          Discover most engaging newsletters, curated based on reader engagement and appreciation. 
          These top picks showcase the best content from our community, featuring insights, analysis, and unique perspectives.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, index) => (
            <PopularNewsletterSkeleton key={`skeleton-${index}`} />
          ))
        ) : (
          newsletters.map((newsletter) => (
            <Card 
              key={newsletter.newsletter_id}
              className="relative h-[450px] flex flex-col text-white group transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => handleCardClick(newsletter)}
            >
              <div
                className="relative p-2 rounded-xl flex-grow flex flex-col justify-between h-full"
                style={{
                  backgroundImage: `url(${newsletter.top_screenshot_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  margin: "12px",
                }}
              >
                <div className="absolute inset-0 bg-torch-700 rounded-lg text-white opacity-0 group-hover:opacity-85 transition-opacity duration-300" />
                
                <CardContent className="relative z-10">
                  {/* Future content placeholder */}
                </CardContent>

                <CardFooter className="relative z-10 flex flex-col items-start w-full">
                  <CardTitle className="text-[#ccc] strong leading-[10px] tracking-tight text-2xl text-pretty mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-white">
                    {newsletter.subject || "No Subject"}
                  </CardTitle>

                  <div className="flex flex-col gap-2 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-3 items-center">
                      {newsletter.likes_count !== null && (
                        <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-sm text-white rounded-full px-2 py-1">
                          <HeartFullIcon className="w-4 h-4" />
                          <span className="text-sm">{newsletter.likes_count}</span>
                        </div>
                      )}
                      {newsletter.you_rocks_count !== null && (
                        <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-sm text-white rounded-full px-2 py-1">
                          <YouRockIcon className="w-4 h-4" />
                          <span className="text-sm">{newsletter.you_rocks_count}</span>
                        </div>
                      )}
                    </div>

                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/${slugify(newsletter.sender || "")}`);
                      }}
                      className="transition-transform duration-300 hover:scale-105"
                    >
                      <CardDescription className="text-white text-xs truncate bg-aquamarine-700 px-2 py-1 inline-block rounded-full hover:bg-aquamarine-600">
                        {newsletter.sender || "Unknown Sender"}
                      </CardDescription>
                    </div>
                  </div>
                </CardFooter>
              </div>
            </Card>
          ))
        )}
      </div>
    </section>
  );
};