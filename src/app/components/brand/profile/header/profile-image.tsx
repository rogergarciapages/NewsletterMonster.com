import Image from "next/image";

import { IconUser } from "@tabler/icons-react";

import { BrandUser } from "../types";

interface ProfileImageProps {
  user: BrandUser | null;
}

export default function ProfileImage({ user }: ProfileImageProps) {
  // Use null check with fallback
  const profilePhoto = user?.profile_photo || null;

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
              icon.innerHTML =
                '<svg width="72" height="72" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="7" r="4" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>';
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
