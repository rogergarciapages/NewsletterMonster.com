// src/lib/utils/upload.ts
export async function uploadProfileImage(file: File): Promise<string> {
  console.log("Starting file upload:", {
    name: file.name,
    type: file.type,
    size: file.size
  });

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/upload/profile-image", {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type here - browser will set it with boundary for FormData
      },
      credentials: "same-origin"
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed with status:", response.status);
      console.error("Error response:", errorText);
      throw new Error(`Upload failed: ${errorText}`);
    }

    const data = await response.json();
    console.log("Upload successful:", data);
    return data.url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}