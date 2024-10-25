import Link from "next/link";
import { Newsletter } from "../types";
import NewsletterStats from "./stats";

interface NewsletterContentProps {
  newsletter: Newsletter;
  brandname: string;
}

export default function NewsletterContent({ newsletter, brandname }: NewsletterContentProps) {
  return (
    <div className="px-4 py-2 flex flex-col" style={{ height: "180px" }}>
      <Link href={`/${brandname}/${newsletter.newsletter_id}`}>
        <h2 className="text-xl font-bold tracking-tight leading-[1em] mb-2 dark:text-white hover:text-torch-600 dark:hover:text-torch-600 transition-colors line-clamp-2">
          {newsletter.subject || "Untitled Newsletter"}
        </h2>
      </Link>

      <div className="flex flex-col mt-auto">
        {newsletter.summary && (
          <p className="text-gray-800 dark:text-gray-300 text-sm line-clamp-2 mb-3">
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