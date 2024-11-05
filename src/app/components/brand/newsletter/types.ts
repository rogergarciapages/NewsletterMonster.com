// src/app/components/brand/newsletter/types.ts
export interface Newsletter {
  newsletter_id: number;
  sender: string | null;
  subject: string | null;
  top_screenshot_url: string | null;
  likes_count: number | null;
  you_rocks_count: number | null;
  created_at: Date | null;
  summary: string | null;
  user_id: string | null;
  content?: string | null;
  html_content?: string | null;
  view_count?: number;
  is_liked?: boolean;
  is_rocked?: boolean;
}

export interface NewsletterCardProps {
  newsletter: Newsletter;
  brandname: string;
  priority?: boolean; // For image loading priority
  showFullContent?: boolean; // For individual newsletter pages
  className?: string; // For custom styling
}

export interface NewsletterStats {
  likes: number | null;
  youRocks: number | null;
  createdAt: Date | null;
  viewCount?: number;
}
