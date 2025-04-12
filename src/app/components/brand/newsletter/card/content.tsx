// src/app/components/brand/newsletter/card/content.tsx
import { memo } from "react";

import { SeoLink } from "@/app/components/brand/seo/seo-link";

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
        className={`mb-2 text-xl font-bold leading-[1em] tracking-tight dark:text-white ${
          !showFullContent
            ? "line-clamp-2 transition-colors hover:text-torch-600 dark:hover:text-torch-600"
            : ""
        }`}
      >
        {newsletter.subject || "Untitled Newsletter"}
      </h2>
    );

    const seoTitle = `Read ${newsletter.subject || "Newsletter"} by ${brandname} on NewsletterMonster.com`;

    // Create the URL object to satisfy type requirements
    const href = {
      pathname: `/brand/${brandname}/${newsletter.newsletter_id}`,
    };

    return (
      <div className="flex flex-col px-4 py-3">
        {showFullContent ? (
          titleContent
        ) : (
          <SeoLink href={href} title={seoTitle} aria-label={seoTitle}>
            {titleContent}
          </SeoLink>
        )}

        <div className="mt-auto flex flex-col justify-end">
          {newsletter.summary && (
            <p className="mb-3 line-clamp-2 text-sm text-gray-800 dark:text-gray-300">
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
