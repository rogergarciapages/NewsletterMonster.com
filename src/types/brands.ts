// src/types/brands.ts
export interface BrandProfile {
  user_id: string;
  company_name: string | null;
  profile_photo: string | null;
  bio: string | null;
  website: string | null;
  website_domain: string | null;
  domain_verified: boolean;
  twitter_username: string | null;
  instagram_username: string | null;
  youtube_channel: string | null;
  linkedin_profile: string | null;
  newsletters: Newsletter[];
  followers_count: number;
  following_count: number;
}

export interface Newsletter {
  newsletter_id: number;
  subject: string;
  date: Date;
  likes_count: number;
  you_rocks_count: number;
}
