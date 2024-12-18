import { Newsletter } from "../types";
import NewsletterContent from "./content";
import NewsletterImage from "./image";

interface NewsletterCardProps {
  newsletter: Newsletter;
  brandname: string;
  priority?: boolean;
}

export default function NewsletterCard({
  newsletter,
  brandname,
  priority = false,
}: NewsletterCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-zinc-800">
      <NewsletterImage
        imageUrl={newsletter.top_screenshot_url}
        subject={newsletter.subject}
        brandname={brandname}
        newsletterId={newsletter.newsletter_id}
        priority={priority}
      />

      <NewsletterContent newsletter={newsletter} brandname={brandname} />
    </article>
  );
}
