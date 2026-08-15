// src/lib/utils/minio.ts
import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://supabasenewsletter.oncewerehumans.com";
const DEFAULT_ANON_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4NjY1MzYwMCwiZXhwIjo0OTQyMzI3MjAwLCJyb2xlIjoiYW5vbiJ9.rmFjH04D-eYhVWMW7zEMHpYCRXapHQqocx3yf4CJu90";

function getSupabaseClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    DEFAULT_ANON_KEY;

  return createClient(url, key);
}

const BUCKET_NAME = process.env.MINIO_BUCKET || "userpics";
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

export async function deleteUserProfileImages(userId: string): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(`public/${userId}`);

    if (listError) {
      console.warn("Could not list images for deletion:", listError.message);
      return;
    }

    if (files && files.length > 0) {
      const paths = files.map((f) => `public/${userId}/${f.name}`);
      const { error: removeError } = await supabase.storage.from(BUCKET_NAME).remove(paths);
      if (removeError) {
        console.warn("Could not remove old images:", removeError.message);
      }
    }
  } catch (error) {
    console.error("Error deleting user profile images:", error);
  }
}

export function isMinioUrl(url: string): boolean {
  if (!url) return false;
  return (
    url.includes("/storage/v1/object/public/") ||
    url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL || "supabase")
  );
}

export async function uploadProfileImage(file: File, userId: string): Promise<string> {
  try {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      throw new Error(`Invalid file type: ${file.type}`);
    }

    const fileExt = file.type.split("/")[1].replace("jpeg", "jpg");
    const filePath = `public/${userId}/${userId}.${fileExt}`;
    const fileBuffer = await file.arrayBuffer();

    await deleteUserProfileImages(userId);

    const supabase = getSupabaseClient();

    // Ensure bucket exists or handle upload directly
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, Buffer.from(fileBuffer), {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage upload error:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading to Supabase Storage:", error);
    throw error;
  }
}
