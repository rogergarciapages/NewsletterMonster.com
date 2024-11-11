export interface Newsletter {
  newsletter_id: number;
  sender: string | null;
  subject: string | null;
  top_screenshot_url: string | null;
  likes_count: number | null;
  you_rocks_count: number | null;
  created_at: Date | null;
  summary: string | null;
}

export interface NewsletterTag {
  Newsletter: Newsletter;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
  Newsletters: NewsletterTag[];
}
