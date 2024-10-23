"use client";

import HeartFullIcon from "@/assets/svg/Heartfull.svg";
import YouRockIcon from "@/assets/svg/Yourockicon.svg";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { slugify } from "@/utils/slugify";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Newsletter } from "../../types";
import ThreeColumnLayout from "../components/layouts/three-column-layout";

const TrendingNewslettersPage: React.FC = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/newsletters/trending", {
          params: { skip: 0, take: 20 }
        });
        console.log("API Response:", response.data);
        setNewsletters(response.data);
      } catch (error) {
        console.error("Error fetching newsletters:", error);
        setError("Failed to fetch newsletters");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsletters();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ThreeColumnLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
        {newsletters.length === 0 ? (
          <div>No trending newsletters found</div>
        ) : (
          newsletters.map((newsletter) => (
            <Card 
              className="relative min-h-[550px] flex flex-col group" 
              key={newsletter.newsletter_id}
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
                  {/* Add content here if needed */}
                </CardContent>
                <CardFooter className="relative z-10 flex flex-col items-start">
                  <Link
                    href={`/${slugify(newsletter.sender || "")}/${newsletter.newsletter_id}`}
                  >
                    <CardTitle className="text-[#ccc] strong leading-tight tracking-tight text-4xl text-pretty mb-6 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {newsletter.subject || "No Subject"}
                    </CardTitle>
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
                    <Link
                      href={`/${slugify(newsletter.sender || "")}`}
                    >
                      <CardDescription className="text-white text-sm truncate bg-aquamarine-700 px-3 py-1 inline-block rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {newsletter.sender || "Unknown Sender"}
                      </CardDescription>
                    </Link>
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