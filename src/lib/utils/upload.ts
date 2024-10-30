// src/lib/utils/upload.ts
export async function uploadProfileImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
  
    const response = await fetch("/api/upload/profile-image", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error("Failed to upload image");
    }
  
    const data = await response.json();
    return data.url;
  }