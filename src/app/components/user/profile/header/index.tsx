// src/app/components/user/profile/header/index.tsx
"use client";

import ProfileImage from "@/app/components/brand/profile/header/profile-image";
import ProfileInfo from "@/app/components/brand/profile/header/profile-info";
import { BrandUser } from "@/app/components/brand/profile/types";
import { Button } from "@nextui-org/react";
import { IconEdit } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  
  // Check if this is the user's own profile
  const isOwnProfile = session?.user?.email === user.email;

  const handleEditProfile = () => {
    router.push(`/user/${user.user_id}/edit`);
  };

  return (
    <div className="p-8 border-b bg-white dark:bg-zinc-800 m-1 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-4">
          <ProfileImage user={user} />
          
          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex-grow">
                <ProfileInfo 
                  brandName={`${user.name}${user.surname ? ` ${user.surname}` : ""}`}
                  user={user}
                  newsletterCount={newsletterCount}
                  followersCount={followersCount}
                />
              </div>
              
              {isOwnProfile && (
                <div className="flex gap-2">
                  <Button
                    color="primary"
                    variant="bordered"
                    onClick={handleEditProfile}
                    startContent={<IconEdit size={20} />}
                  >
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}