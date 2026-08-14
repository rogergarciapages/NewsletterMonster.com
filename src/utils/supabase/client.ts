import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://supabasenewsletter.oncewerehumans.com";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4NjY1MzYwMCwiZXhwIjo0OTQyMzI3MjAwLCJyb2xlIjoiYW5vbiJ9.rmFjH04D-eYhVWMW7zEMHpYCRXapHQqocx3yf4CJu90";

export const createClient = () => createBrowserClient(supabaseUrl, supabaseKey);
