"use client";

import HeartFullIcon from '@/assets/svg/Heartfull.svg';
import YouRockIcon from '@/assets/svg/Yourockicon.svg';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { slugify } from '@/utils/slugify';
import axios from "axios";
import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { Newsletter } from "../../types";
import ThreeColumnLayout from "../components/layouts/three-column-layout";

const TrendingNewslettersPage: React.FC = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await axios.get("/api/newsletters/trending", {
          params: { skip: 0, take: 20 }
        });
        setNewsletters(response.data);
      } catch (error) {
        console.error("Error fetching newsletters", error);
      }
    };

    fetchNewsletters();
  }, []);

  return (
    <ThreeColumnLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
        {newsletters.map((newsletter) => (
          <Card className="relative min-h-[550px] flex flex-col group" key={newsletter.newsletter_id}>
            <div
              className="relative p-4 rounded-xl flex-grow flex flex-col justify-between"
              style={{
                backgroundImage: `url(${newsletter.top_screenshot_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                margin: '15px',
              }}
            >
              <div className="absolute inset-0 bg-torch-700 opacity-0 group-hover:opacity-85 transition-opacity duration-300"></div>
              <CardContent className="relative z-10">
                {/* Add content here if needed */}
              </CardContent>
              <CardFooter className="relative z-10 flex flex-col items-start">
  <Link
    href={{
      pathname: `/brands/[sender]/newsletter/[newsletter_id]`,
      query: { sender: slugify(newsletter.sender || ""), newsletter_id: newsletter.newsletter_id.toString() }
    }}
  >
    <a>
      <CardTitle className="text-white text-3xl text-pretty mb-6 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {newsletter.subject || 'No Subject'}
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
    <Link
      href={{
        pathname: `/brands/[sender]`,
        query: { sender: slugify(newsletter.sender || "") }
      }}
    >
      <a>
        <CardDescription className="text-white text-sm truncate bg-aquamarine-700 px-3 py-1 inline-block rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {newsletter.sender || 'Unknown Sender'}
        </CardDescription>
      </a>
    </Link>
  </div>
</CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </ThreeColumnLayout>
  );
};

export default TrendingNewslettersPage;
