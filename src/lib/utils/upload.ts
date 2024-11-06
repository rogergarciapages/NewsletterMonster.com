// src/lib/utils/upload.ts
export async function uploadProfileImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/upload/profile-image", {
      method: "POST",
      body: formData,
      headers: {},
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
