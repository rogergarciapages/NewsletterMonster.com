// src/app/components/user/profile/header/index.tsx
"use client";

import { useSession } from "next-auth/react";

import ProfileImage from "@/app/components/brand/profile/header/profile-image";
import ProfileInfo from "@/app/components/brand/profile/header/profile-info";
import { BrandUser } from "@/app/components/brand/profile/types";

// src/app/components/user/profile/header/index.tsx

interface UserProfileHeaderProps {
  user: BrandUser;
  newsletterCount: number;
  followersCount: number;
}

export default function UserProfileHeader({
  user,
  newsletterCount,
  followersCount,
}: UserProfileHeaderProps) {
  const { data: session } = useSession();

  // Check if this is the user's own profile
  const isOwnProfile = session?.user?.email === user.email;

  return (
    <div className="m-1 rounded-lg border-b bg-white p-8 dark:bg-zinc-800">
      <div className="mx-auto max-w-6xl">
        <div className="flex gap-4">
          <ProfileImage user={user} />

          <div className="flex-grow">
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <div className="flex-grow">
                <ProfileInfo
                  brandName={`${user.name}${user.surname ? ` ${user.surname}` : ""}`}
                  user={user}
                  newsletterCount={newsletterCount}
                  followersCount={followersCount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
