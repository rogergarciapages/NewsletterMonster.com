"use client";

import NextLink from "next/dist/client/link";
import React, { useCallback, useEffect, useState } from "react";

import { useInView } from "react-intersection-observer";
import slugify from "slugify";

import HeartFullIcon from "@/assets/svg/Heartfull.svg";
import YouRockIcon from "@/assets/svg/Yourockicon.svg";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";

import { Newsletter } from "../../types";

interface TrendingPageClientProps {
  newsletters: Newsletter[];
}

const fetchMoreNewsletters = async (skip: number, take: number): Promise<Newsletter[]> => {
  const response = await fetch(`/api/newsletters/popular?skip=${skip}&take=${take}`);
  if (!response.ok) {
    throw new Error("Failed to fetch newsletters");
  }
  return await response.json();
};

const TrendingPageClient: React.FC<TrendingPageClientProps> = ({
  newsletters: initialNewsletters,
}) => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>(initialNewsletters);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1 });

  const loadMoreItems = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const moreNewsletters = await fetchMoreNewsletters(newsletters.length, 11); // Fetch 11 more newsletters
      setNewsletters(prev => [...prev, ...moreNewsletters]);
    } catch (error) {
      console.error("Error fetching newsletters:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, newsletters.length]);

  useEffect(() => {
    if (inView && !loading) {
      loadMoreItems();
    }
  }, [inView, loading, loadMoreItems]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 p-2 md:grid-cols-2">
        {newsletters.map((newsletter, index) => {
          const isLast = index === newsletters.length - 1;
          return (
            <Card
              ref={isLast ? ref : null}
              className="group relative flex min-h-[550px] flex-col"
              key={newsletter.newsletter_id}
            >
              <div
                className="relative flex flex-grow flex-col justify-between rounded-xl p-4"
                style={{
                  backgroundImage: `url(${newsletter.top_screenshot_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  margin: "15px",
                }}
              >
                <div className="absolute inset-0 bg-torch-700 opacity-0 transition-opacity duration-300 group-hover:opacity-85"></div>
                <CardContent className="relative z-10">
                  {/* Add content here if needed */}
                </CardContent>
                <CardFooter className="relative z-10 flex flex-col items-start">
                  <NextLink
                    href={`/brands/${slugify(newsletter.sender || "")}/newsletter/${newsletter.newsletter_id}`}
                  >
                    <CardTitle className="mb-6 text-pretty p-1 text-3xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {newsletter.subject || "No Subject"}
                    </CardTitle>
                  </NextLink>
                  <div className="mt-2 flex w-full items-center justify-between">
                    <div className="flex items-center space-x-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {newsletter.likes_count !== null && (
                        <div className="flex items-center space-x-2 rounded-full bg-black px-3 py-1 text-white">
                          <HeartFullIcon className="h-5 w-5" />
                          <span className="text-base">{newsletter.likes_count}</span>
                        </div>
                      )}
                      {newsletter.you_rocks_count !== null && (
                        <div className="flex items-center space-x-2 rounded-full bg-black px-3 py-1 text-white">
                          <YouRockIcon className="h-5 w-5" />
                          <span className="text-base">{newsletter.you_rocks_count}</span>
                        </div>
                      )}
                    </div>
                    <NextLink href={`/brands/${slugify(newsletter.sender || "")}`}>
                      <CardDescription className="inline-block truncate rounded-full bg-aquamarine-700 px-3 py-1 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {newsletter.sender || "Unknown Sender"}
                      </CardDescription>
                    </NextLink>
                  </div>
                </CardFooter>
              </div>
            </Card>
          );
        })}
      </div>
      {loading && <div>Loading more newsletters...</div>}
    </div>
  );
};

export default TrendingPageClient;
