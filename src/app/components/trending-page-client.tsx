"use client";

import HeartFullIcon from "@/assets/svg/Heartfull.svg";
import YouRockIcon from "@/assets/svg/Yourockicon.svg";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import slugify from "slugify";
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

const TrendingPageClient: React.FC<TrendingPageClientProps> = ({ newsletters: initialNewsletters }) => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>(initialNewsletters);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1 });

  const loadMoreItems = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    console.log("Fetching more newsletters...");
    try {
      const moreNewsletters = await fetchMoreNewsletters(newsletters.length, 11); // Fetch 11 more newsletters
      console.log("Fetched newsletters:", moreNewsletters);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
        {newsletters.map((newsletter, index) => {
          const isLast = index === newsletters.length - 1;
          return (
            <Card ref={isLast ? ref : null} className="relative min-h-[550px] flex flex-col group" key={newsletter.newsletter_id}>
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
                <div className="absolute inset-0 bg-torch-700 opacity-0 group-hover:opacity-85 transition-opacity duration-300"></div>
                <CardContent className="relative z-10">
                  {/* Add content here if needed */}
                </CardContent>
                <CardFooter className="relative z-10 flex flex-col items-start">
                  <Link ref={`/brands/${slugify(newsletter.sender || "")}/newsletter/${newsletter.newsletter_id}`} href={"/"}>
                    <a>
                      <CardTitle className="text-white text-3xl text-pretty mb-6 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {newsletter.subject || "No Subject"}
                      </CardTitle>
                    </a>
                  </Link>
                  <div className="flex justify-between items-center w-full mt-2">
                    <div className="flex space-x-4 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {newsletter.likes_count !== null && (
                        <div className="flex items-center space-x-2 bg-black text-white rounded-full px-3 py-1">
                          <HeartFullIcon className="w-5 h-5" />
                          <span className="text-base">{newsletter.likes_count}</span>
                        </div>
                      )}
                      {newsletter.you_rocks_count !== null && (
                        <div className="flex items-center space-x-2 bg-black text-white rounded-full px-3 py-1">
                          <YouRockIcon className="w-5 h-5" />
                          <span className="text-base">{newsletter.you_rocks_count}</span>
                        </div>
                      )}
                    </div>
                    <Link ref={`/brands/${slugify(newsletter.sender || "")}`} href={"/"}>
                      <a>
                        <CardDescription className="text-white text-sm truncate bg-aquamarine-700 px-3 py-1 inline-block rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {newsletter.sender || "Unknown Sender"}
                        </CardDescription>
                      </a>
                    </Link>
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
