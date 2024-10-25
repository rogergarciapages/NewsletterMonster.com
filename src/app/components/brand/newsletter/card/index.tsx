import { Newsletter } from "../types";
import NewsletterContent from "./content";
import NewsletterImage from "./image";

interface NewsletterCardProps {
  newsletter: Newsletter;
  brandname: string;
}

export default function NewsletterCard({ newsletter, brandname }: NewsletterCardProps) {
  return (
    <article className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <NewsletterImage 
        imageUrl={newsletter.top_screenshot_url}
        subject={newsletter.subject}
        brandname={brandname}
        newsletterId={newsletter.newsletter_id}
      />
      
      <NewsletterContent 
        newsletter={newsletter}
        brandname={brandname}
      />
    </article>
  );
}