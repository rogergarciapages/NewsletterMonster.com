// src/components/newsletters/newsletter-card.tsx
import HeartFullIcon from "@/assets/svg/Heartfull.svg";
import YouRockIcon from "@/assets/svg/Yourockicon.svg";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { slugify } from "@/utils/slugify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Newsletter } from "../../components/brand/newsletter/types";

interface NewsletterCardProps {
  newsletter: Newsletter;
  priority?: boolean;
}

export const NewsletterCard = ({ newsletter, priority = false }: NewsletterCardProps) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleSenderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/${slugify(newsletter.sender || "")}`);
  };

  // Format date with null check
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  // Default image for newsletters without a screenshot
  const defaultImage = "/images/newsletter-placeholder.jpg"; // Make sure to create this placeholder image

  return (
    <Card 
      className="group relative w-full transition-transform duration-300 hover:scale-[1.02] cursor-pointer bg-gradient-to-b from-torch-900 to-gray-900"
      onClick={() => router.push(`/${slugify(newsletter.sender || "")}/${newsletter.newsletter_id}`)}
    >
      {/* Aspect ratio container */}
      <div className="relative w-full pt-[132.35%]"> {/* 900/680 ≈ 1.3235 */}
        <div className="absolute inset-0 m-2 rounded-lg overflow-hidden">
          {!imageError ? (
            <Image
              src={newsletter.top_screenshot_url || defaultImage}
              alt={newsletter.subject || "Newsletter preview"}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-5"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              priority={priority}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900" />
          )}
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between py-2">
          <CardContent>
            <CardTitle className="text-xl text-white tracking-tight leading-[1em] pt-4 mb-2 line-clamp-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {newsletter.subject || "No Subject"}
            </CardTitle>
            
            {newsletter.created_at && (
              <div className="text-xs text-gray-300 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {formatDate(newsletter.created_at)}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col items-start align-bottom px-4 py-1 gap-2">
            <div className="flex space-x-4 items-center">
              {typeof newsletter.likes_count === "number" && (
                <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-sm text-white rounded-full px-2 py-1">
                  <HeartFullIcon className="w-4 h-4" />
                  <span className="text-xs">{newsletter.likes_count}</span>
                </div>
              )}
              {typeof newsletter.you_rocks_count === "number" && (
                <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-sm text-white rounded-full px-3 py-1">
                  <YouRockIcon className="w-4 h-4" />
                  <span className="text-xs">{newsletter.you_rocks_count}</span>
                </div>
              )}
            </div>

            <button 
              onClick={handleSenderClick}
              className="transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-aquamarine-500 rounded-full"
            >
              <CardDescription className="text-white text-xs truncate bg-aquamarine-700 px-3 py-1 inline-block rounded-full hover:bg-aquamarine-600">
                {newsletter.sender || "Unknown Sender"}
              </CardDescription>
            </button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};