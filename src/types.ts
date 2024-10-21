// Define User type
export interface User {
  user_id: string;
  profile_photo?: string;
  name: string;
  surname: string;
  company_name: string;
  username: string;
  email: string;
  bio?: string;
  website?: string;
  location?: string;
  date_of_birth?: Date | string | null;
  status?: string;
  last_login?: Date | string | null;
  emailVerified?: Date | string | null;
  twitter_username?: string;
  instagram_username?: string;
  newsletters: Newsletter[];
}

// Define Post type
export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: User;
}

// Define Newsletter type
export interface Newsletter {
  newsletter_id: number;
  subject: string | null;
  content: string | null;
  createdAt: Date | string | null; // Add string to handle serialization
  author: User | null; // Ensure author is of type User
  user_id: string | null;
  sender: string | null;
  date: Date | string | null; // Add string to handle serialization
  html_file_url: string | null;
  full_screenshot_url: string | null;
  top_screenshot_url: string | null;
  likes_count: number | null;
  you_rocks_count: number | null;
  summary: string | null; // Add summary field here
}
