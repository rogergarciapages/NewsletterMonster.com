// src/app/components/brand/newsletter/card/content.tsx
import Link from "next/link";
import { memo } from "react";

import { Newsletter } from "../types";
import NewsletterStats from "./stats";

interface NewsletterContentProps {
  newsletter: Newsletter;
  brandname: string;
  showFullContent?: boolean;
}

const NewsletterContent = memo(
  ({ newsletter, brandname, showFullContent = false }: NewsletterContentProps) => {
    const titleContent = (
      <h2
        className={`mb-2 text-xl font-bold leading-[1em] tracking-tight dark:text-white ${!showFullContent ? "line-clamp-2 transition-colors hover:text-torch-600 dark:hover:text-torch-600" : ""}`}
      >
        {newsletter.subject || "Untitled Newsletter"}
      </h2>
    );

    return (
      <div className={`flex flex-col px-4 py-2 ${showFullContent ? "" : "h-[180px]"}`}>
        {showFullContent ? (
          titleContent
        ) : (
          <Link href={`/${brandname}/${newsletter.newsletter_id}`}>{titleContent}</Link>
        )}

        <div className="mt-auto flex flex-col">
          {newsletter.summary && (
            <p
              className={`text-sm text-gray-800 dark:text-gray-300 ${
                showFullContent ? "" : "line-clamp-2"
              } mb-3`}
            >
              {newsletter.summary}
            </p>
          )}

          <NewsletterStats
            likes={newsletter.likes_count}
            youRocks={newsletter.you_rocks_count}
            createdAt={newsletter.created_at}
          />
        </div>
      </div>
    );
  }
);

NewsletterContent.displayName = "NewsletterContent";

export default NewsletterContent;
