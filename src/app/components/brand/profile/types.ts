// src/app/components/brand/profile/types.ts
export interface BrandUser {
  user_id: string;
  name: string;
  surname: string | null;
  company_name: string | null;
  username: string | null;
  email: string;
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
  isFollowing?: boolean;
  onFollowChange?: (newState: boolean) => void;
  onClaimProfile?: () => void;
  hideFollowButton?: boolean; // New prop to control follow button visibility
  isOwnProfile?: boolean; // New prop to identify self-profile view
}

export interface FollowButtonProps {
  targetId: string;
  isUnclaimed?: boolean;
  initialIsFollowing?: boolean;
  onFollowStateChange?: (isFollowing: boolean) => void;
}
