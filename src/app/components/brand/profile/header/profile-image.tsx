import { IconBriefcase } from "@tabler/icons-react";
import Image from "next/image";
import { BrandUser } from "../types";

interface ProfileImageProps {
  user: BrandUser | null;
}

export default function ProfileImage({ user }: ProfileImageProps) {
  return (
    <div className="w-32 h-32 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden relative">
      {user?.profile_photo ? (
        <Image
          src={user.profile_photo}
          alt={`${user.name}'s profile`}
          fill
          className="object-cover"
          sizes="128px"
          priority
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-gray-500">
          <IconBriefcase size={72} />
        </div>
      )}
    </div>
  );
}