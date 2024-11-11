export interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TagWithNewsletters extends Tag {
  newsletters: {
    newsletter_id: number;
    sender: string | null;
    subject: string | null;
    top_screenshot_url: string | null;
    likes_count: number | null;
    you_rocks_count: number | null;
    created_at: Date | null;
    summary: string | null;
  }[];
}

// Add a type guard
export function isValidTag(tag: any): tag is Tag {
  return (
    tag &&
    typeof tag.id === "number" &&
    typeof tag.name === "string" &&
    typeof tag.slug === "string" &&
    typeof tag.count === "number"
  );
}
