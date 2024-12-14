"use client";

import { useState } from "react";

import { Button } from "@nextui-org/react";
import { IconPlus } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/assets/avatar";
import { useMediaQuery } from "@/hooks/use-media-query";

interface SuggestedUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
}

const EXAMPLE_USERS: SuggestedUser[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    username: "sarahjohnsonn",
    bio: "Tech enthusiast & developer",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    name: "Michael Brown",
    username: "michaelbrown",
    bio: "Digital marketing expert",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    name: "Emily Davis",
    username: "emilydavis",
    bio: "Content creator",
    avatar: "/placeholder-user.jpg",
  },
];

export default function WhoToFollow() {
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isLarge = useMediaQuery("(min-width: 1024px)");

  const handleUserInteraction = (userId: string | null) => {
    if (isMobile) {
      setActiveUser(activeUser === userId ? null : userId);
    } else {
      setActiveUser(userId);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold">Who to follow</h3>
      <div className="grid gap-4">
        {EXAMPLE_USERS.map(user => (
          <div
            key={user.id}
            className="relative rounded-lg transition-colors hover:bg-content1"
            onMouseEnter={() => !isMobile && handleUserInteraction(user.id)}
            onMouseLeave={() => !isMobile && handleUserInteraction(null)}
            onClick={() => isMobile && handleUserInteraction(user.id)}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{user.name}</div>
                <div className="truncate text-sm text-muted-foreground">@{user.username}</div>
              </div>
              <Button isIconOnly variant="ghost" size="sm" className="ml-auto">
                <IconPlus className="h-4 w-4" />
              </Button>
            </div>
            {!isMobile && (
              <div
                className={`absolute inset-0 flex items-center justify-center bg-background/80 transition-opacity ${
                  activeUser === user.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className={isLarge ? "w-full px-2" : "w-[90%]"}>
                  <Button
                    className={isLarge ? "w-full" : undefined}
                    variant="solid"
                    color="primary"
                  >
                    Follow
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Button variant="light" size="sm" className="mt-2 w-full text-sm">
        Show more
      </Button>
    </div>
  );
}
