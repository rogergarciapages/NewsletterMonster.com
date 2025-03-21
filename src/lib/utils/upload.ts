// src/lib/utils/upload.ts
import { getSession } from "next-auth/react";

/**
 * Uploads a profile image to the server with improved error handling and transaction support
 * Uses a two-phase approach where image is uploaded first, then the profile is updated separately
 *
 * @param file The image file to upload
 * @returns The URL of the uploaded image or null if upload fails
 */
export async function uploadProfileImage(file: File): Promise<string | null> {
  const session = await getSession();
  if (!session?.user?.user_id) {
    throw new Error("User not authenticated");
  }

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

  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", session.user.user_id);
  formData.append("transaction_id", generateTransactionId()); // For potential rollback

  try {
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
        // If parsing JSON fails, try to get the text
        try {
          errorMessage = await response.text();
        } catch (_) {
          // If that fails too, use status code
          errorMessage = `Upload failed with status: ${response.status}`;
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    // Rethrow the error with a user-friendly message
    if (error instanceof Error) {
      throw error; // Already formatted error
    }
    throw new Error("Failed to upload image. Please try again.");
  }
}

/**
 * Generate a unique transaction ID for the upload process
 * This can be used to track and potentially rollback failed transactions
 */
function generateTransactionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
