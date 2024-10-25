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
    twitter_username: string | null;
    instagram_username: string | null;
    youtube_channel: string | null;
    linkedin_profile: string | null;
    role: string | null;
  }
  
  export interface BrandProfileProps {
    brandName: string;
    user: BrandUser | null;
    newsletterCount: number;
    followersCount: number;
    isFollowing?: boolean;
    onFollowChange?: (newState: boolean) => void;
    onClaimProfile?: () => void;
  }
  
  export interface FollowButtonProps {
    brandId: string;
    isUnclaimed: boolean;  // Changed from isUnclaimedProfile
    initialIsFollowing: boolean;
    onFollowStateChange: (isFollowing: boolean) => void;
  }