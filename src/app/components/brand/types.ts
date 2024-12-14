export interface BrandUser {
  user_id: string;
  name: string;
  email: string;
  surname: string | null;
  company_name: string | null;
  username: string | null;
  profile_photo: string | null;
  bio: string | null;
  website: string | null;
  website_domain: string | null;
  domain_verified: boolean;
  twitter_username: string | null;
  instagram_username: string | null;
  youtube_channel: string | null;
  linkedin_profile: string | null;
  role: string;
}

export interface BrandProfileProps {
  brandName: string;
  user: BrandUser | null;
  newsletterCount: number;
  followersCount: number;
  isFollowing: boolean;
  hideFollowButton: boolean;
  isOwnProfile: boolean;
}
