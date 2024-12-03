export interface Newsletter {
  newsletter_id: number;
  sender: string | null;
  subject: string | null;
  top_screenshot_url: string | null;
  likes_count: number;
  you_rocks_count: number;
  created_at: Date;
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
