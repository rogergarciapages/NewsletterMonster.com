export interface UserData {
    user_id: string;
    name: string;
    surname: string;
    company_name: string;
    username: string;
    email: string;
    profile_photo: string | null;
    bio: string | null;
    website: string | null;
    location: string | null;
    date_of_birth: Date | null;
    twitter_username: string | null;
    instagram_username: string | null;
    youtube_channel: string | null;
    linkedin_profile: string | null; // Add this field
    // Add other fields as necessary
  }
  