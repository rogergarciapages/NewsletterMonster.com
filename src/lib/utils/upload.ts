// src/lib/utils/upload.ts
import { getSession } from "next-auth/react";

export async function uploadProfileImage(file: File): Promise<string> {
  const session = await getSession();
  if (!session?.user?.user_id) {
    throw new Error("User not authenticated");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", session.user.user_id);

  try {
    const response = await fetch("/api/upload/profile-image", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed with status:", response.status);
      console.error("Error response:", errorText);
      throw new Error(`Upload failed: ${errorText}`);
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    throw error;
  }
}
