import Image from "next/image";

import { IconUser } from "@tabler/icons-react";

import { BrandUser } from "../types";

interface ProfileImageProps {
  user: BrandUser | null;
}

// Utility function to ensure profile image URL has the correct structure
const ensureCorrectImageUrl = (url: string | null): string | null => {
  if (!url) return null;

  // If URL already starts with the expected pattern, return it as is
  if (url.includes("/userpics/public/")) {
    console.log("URL appears to be in correct format already");
    return url;
  }

  // Extract the file extension from the original URL
  const extensionMatch = url.match(/\.([a-z]+)$/i);
  const fileExtension = extensionMatch ? extensionMatch[1].toLowerCase() : "jpg";

  // Try to extract the user ID from the URL
  const match = url.match(/\/([a-f0-9-]+)\/([a-f0-9-]+)(-\d+)?\.(jpg|jpeg|png|webp|gif)$/i);
  if (match) {
    const userId = match[1];
    // Use the extension from the original URL if available, otherwise use the extracted one
    const extension = match[4] ? match[4].toLowerCase() : fileExtension;

    // Construct the URL with the correct path structure (without timestamp)
    const minioEndpoint = url.split("/userpics")[0];
    const correctedUrl = `${minioEndpoint}/userpics/public/${userId}/${userId}.${extension}`;
    console.log("Corrected URL:", correctedUrl);
    return correctedUrl;
  }

  console.log("URL correction failed, returning original URL");
  return url;
};

export default function ProfileImage({ user }: ProfileImageProps) {
  // Use null check with fallback and ensure correct URL structure
  const profilePhoto = ensureCorrectImageUrl(user?.profile_photo || null);

  // Log the image URL being used (for debugging)
  if (profilePhoto) {
    console.log("Using profile image URL:", profilePhoto);
  }

  return (
    <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
      {profilePhoto ? (
        <Image
          src={profilePhoto}
          alt={`${user?.name || "User"}'s profile`}
          fill
          className="object-cover"
          sizes="128px"
          priority
          onError={e => {
            // Handle image loading errors
            console.error("Failed to load profile image:", profilePhoto);
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite error loop
            target.style.display = "none"; // Hide the broken image
            // Show fallback icon
            const parentDiv = target.parentElement;
            if (parentDiv) {
              parentDiv.classList.add(
                "flex",
                "items-center",
                "justify-center",
                "bg-gray-200",
                "text-gray-400",
                "dark:bg-zinc-700",
                "dark:text-gray-500"
              );
              const icon = document.createElement("div");
              // Create SVG element programmatically instead of using innerHTML
              const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
              svgElement.setAttribute("width", "72");
              svgElement.setAttribute("height", "72");
              svgElement.setAttribute("viewBox", "0 0 24 24");
              svgElement.setAttribute("stroke-width", "1.5");
              svgElement.setAttribute("stroke", "currentColor");
              svgElement.setAttribute("fill", "none");

              const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
              path1.setAttribute("stroke", "none");
              path1.setAttribute("d", "M0 0h24v24H0z");
              path1.setAttribute("fill", "none");

              const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              circle.setAttribute("cx", "12");
              circle.setAttribute("cy", "7");
              circle.setAttribute("r", "4");

              const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
              path2.setAttribute("d", "M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2");

              svgElement.appendChild(path1);
              svgElement.appendChild(circle);
              svgElement.appendChild(path2);
              icon.appendChild(svgElement);
              parentDiv.appendChild(icon);
            }
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-gray-500">
          <IconUser size={72} />
        </div>
      )}
    </div>
  );
}
