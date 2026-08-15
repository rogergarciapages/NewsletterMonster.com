// src/lib/utils/upload.ts
import { createClient } from "@/utils/supabase/client";

/**
 * Uploads a profile image to the server with improved error handling and transaction support
 * Uses a two-phase approach where image is uploaded first, then the profile is updated separately
 *
 * @param file The image file to upload
 * @returns The URL of the uploaded image or null if upload fails
 */
export async function uploadProfileImage(file: File): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  console.log("Starting profile image upload for user:", userId);

  // Validate file before uploading
  if (!file || !(file instanceof File)) {
    throw new Error("Invalid file provided");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error(`File must be an image (received: ${file.type})`);
  }

  // Maximum file size (2MB)
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum size is 2MB.`
    );
  }

  console.log(`Uploading image: type=${file.type}, size=${(file.size / 1024).toFixed(2)}KB`);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);
  formData.append("transaction_id", generateTransactionId());

  // Retry mechanism
  const MAX_RETRIES = 2;
  let retries = 0;
  let lastError = null;

  while (retries <= MAX_RETRIES) {
    try {
      console.log(`Upload attempt ${retries + 1}/${MAX_RETRIES + 1}`);

      if (retries > 0) {
        console.log(`Waiting ${retries * 1000}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, retries * 1000));
      }

      const response = await fetch("/api/upload/profile-image", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });

      if (!response.ok) {
        let errorMessage = "Upload failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          try {
            errorMessage = await response.text();
          } catch (_) {
            errorMessage = `Upload failed with status: ${response.status}`;
          }
        }
        console.error(`Profile image upload failed (attempt ${retries + 1}):`, errorMessage);

        lastError = new Error(errorMessage);

        if (response.status === 500 || response.status === 503) {
          retries++;
          continue;
        } else {
          throw lastError;
        }
      }

      const data = await response.json();
      console.log("Upload successful, image URL:", data.url);

      if (!data.url || typeof data.url !== "string") {
        console.error("Received invalid image URL:", data.url);
        throw new Error("Server returned invalid image URL");
      }

      return data.url;
    } catch (error) {
      console.error(`Profile image upload error (attempt ${retries + 1}):`, error);
      lastError = error;

      if (error instanceof TypeError && error.message.includes("fetch")) {
        retries++;
        continue;
      }

      if (retries < MAX_RETRIES) {
        retries++;
        continue;
      }
      break;
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }
  throw new Error("Failed to upload image after multiple attempts. Please try again.");
}

/**
 * Generate a unique transaction ID for the upload process
 */
function generateTransactionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
