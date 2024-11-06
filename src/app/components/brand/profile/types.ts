// src/app/components/brand/profile/types.ts
export interface Newsletter {
  newsletter_id: number;
  subject: string;
  date: Date;
  likes_count: number;
  you_rocks_count: number;
}

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
  onFollowChange: (newState: boolean) => Promise<void>;
  onClaimProfile?: () => void;
  hideFollowButton?: boolean;
  isOwnProfile?: boolean;
}
export interface FollowButtonProps {
  targetId: string;
  isUnclaimed?: boolean;
  initialIsFollowing?: boolean;
  onFollowStateChange?: (isFollowing: boolean) => void;
}
