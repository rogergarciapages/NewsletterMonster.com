// src/app/trending/page.tsx
"use client";

import { NewsletterCardSkeleton } from "@/app/components/skeleton/newsletter-card-skeleton";
import HeartFullIcon from "@/assets/svg/Heartfull.svg";
import YouRockIcon from "@/assets/svg/Yourockicon.svg";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { slugify } from "@/utils/slugify";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Newsletter } from "../components/brand/newsletter/types";
import ThreeColumnLayout from "../components/layouts/three-column-layout";

const TrendingNewslettersPage = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/newsletters/trending", {
          params: { skip: 0, take: 20 }
        });
        setNewsletters(response.data);
      } catch (error) {
        console.error("Error fetching newsletters:", error);
        setError("Failed to fetch newsletters. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsletters();
  }, []);

  const handleCardClick = (newsletter: Newsletter) => {
    router.push(`/${slugify(newsletter.sender || "")}/${newsletter.newsletter_id}`);
  };

  if (error) {
    return (
      <ThreeColumnLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
          <div className="text-red-500 mb-4">{error}</div>
          <Button 
            color="primary" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
        {isLoading ? (
          // Show skeleton cards while loading
          Array.from({ length: 6 }).map((_, index) => (
            <NewsletterCardSkeleton key={index} />
          ))
        ) : newsletters.length === 0 ? (
          <div className="col-span-2 text-center p-8 text-gray-600">
            No trending newsletters found at the moment.
          </div>
        ) : (
          newsletters.map((newsletter) => (
            <Card 
              className="relative min-h-[550px] text-white flex flex-col group transition-transform duration-300 hover:scale-[1.02] cursor-pointer" 
              key={newsletter.newsletter_id}
              onClick={() => handleCardClick(newsletter)}
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
                <div className="absolute inset-0 bg-torch-700 rounded-lg text-white opacity-0 group-hover:opacity-85 transition-opacity duration-300" />
                
                <CardContent className="relative z-10">
                  {/* Future content placeholder */}
                </CardContent>

                <CardFooter className="relative z-10 flex flex-col items-start">
                  <CardTitle className="text-[#ccc] strong leading-tight tracking-tight text-4xl text-pretty mb-6 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-white">
                    {newsletter.subject || "No Subject"}
                  </CardTitle>

                  <div className="flex justify-between items-center w-full mt-2">
                    <div className="flex space-x-4 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {newsletter.likes_count !== null && (
                        <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-sm text-white rounded-full px-3 py-1">
                          <HeartFullIcon className="w-5 h-5" />
                          <span className="text-base">{newsletter.likes_count}</span>
                        </div>
                      )}
                      {newsletter.you_rocks_count !== null && (
                        <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-sm text-white rounded-full px-3 py-1">
                          <YouRockIcon className="w-5 h-5" />
                          <span className="text-base">{newsletter.you_rocks_count}</span>
                        </div>
                      )}
                    </div>

                    <div 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        router.push(`/${slugify(newsletter.sender || "")}`);
                      }}
                      className="transition-transform duration-300 hover:scale-105"
                    >
                      <CardDescription className="text-white text-sm truncate bg-aquamarine-700 px-3 py-1 inline-block rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-aquamarine-600">
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
    </ThreeColumnLayout>
  );
};

export default TrendingNewslettersPage;