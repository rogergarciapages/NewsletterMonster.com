"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button, Tooltip } from "@nextui-org/react";
import { IconUserPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/assets/avatar";
import { useMediaQuery } from "@/hooks/use-media-query";

import LoginModal from "./login-modal";

interface SuggestedUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  followerCount: number;
}

export default function WhoToFollow() {
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isLarge = useMediaQuery("(min-width: 1024px)");
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/users/popular?limit=3");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setSuggestedUsers(data);
          } else {
            // Fallback for testing - sample brands when none are returned
            setSuggestedUsers([
              {
                id: "sample1",
                name: "TechInsider",
                username: "tech-insider",
                avatar: "/placeholder-brand.png",
                bio: "Latest tech news and reviews",
                followerCount: 120,
              },
              {
                id: "sample2",
                name: "Business Weekly",
                username: "business-weekly",
                avatar: "/placeholder-brand.png",
                bio: "Business insights and market analysis",
                followerCount: 85,
              },
              {
                id: "sample3",
                name: "Design Trends",
                username: "design-trends",
                avatar: "/placeholder-brand.png",
                bio: "Modern design trends and inspiration",
                followerCount: 67,
              },
            ]);
          }
        } else {
          console.error("Failed to fetch popular users");
          // Use the same fallback data if API call fails
          setSuggestedUsers([
            {
              id: "sample1",
              name: "TechInsider",
              username: "tech-insider",
              avatar: "/placeholder-brand.png",
              bio: "Latest tech news and reviews",
              followerCount: 120,
            },
            {
              id: "sample2",
              name: "Business Weekly",
              username: "business-weekly",
              avatar: "/placeholder-brand.png",
              bio: "Business insights and market analysis",
              followerCount: 85,
            },
            {
              id: "sample3",
              name: "Design Trends",
              username: "design-trends",
              avatar: "/placeholder-brand.png",
              bio: "Modern design trends and inspiration",
              followerCount: 67,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching suggested users:", error);
        // Use the same fallback data if an error occurs
        setSuggestedUsers([
          {
            id: "sample1",
            name: "TechInsider",
            username: "tech-insider",
            avatar: "/placeholder-brand.png",
            bio: "Latest tech news and reviews",
            followerCount: 120,
          },
          {
            id: "sample2",
            name: "Business Weekly",
            username: "business-weekly",
            avatar: "/placeholder-brand.png",
            bio: "Business insights and market analysis",
            followerCount: 85,
          },
          {
            id: "sample3",
            name: "Design Trends",
            username: "design-trends",
            avatar: "/placeholder-brand.png",
            bio: "Modern design trends and inspiration",
            followerCount: 67,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, [session?.user?.user_id]); // Refetch when user changes

  const handleUserInteraction = (userId: string | null) => {
    if (isMobile) {
      setActiveUser(activeUser === userId ? null : userId);
    } else {
      setActiveUser(userId);
    }
  };

  const handleFollow = async (brandId: string) => {
    if (!session?.user) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandId,
          action: "follow",
        }),
      });

      if (response.ok) {
        // Remove the brand from suggestions after following
        setSuggestedUsers(prev => prev.filter(user => user.id !== brandId));
      }
    } catch (error) {
      console.error("Error following brand:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">Who to follow</h3>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex animate-pulse space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-3 w-5/6 rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestedUsers.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold">Who to follow</h3>
        <div className="text-sm text-muted-foreground">No suggestions available right now.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-x-hidden">
      <h3 className="text-lg font-bold">Who to follow</h3>
      <div className="grid gap-4">
        {suggestedUsers.map(user => (
          <div
            key={user.id}
            className="relative rounded-lg transition-colors hover:bg-content1"
            onMouseEnter={() => !isMobile && handleUserInteraction(user.id)}
            onMouseLeave={() => !isMobile && handleUserInteraction(null)}
            onClick={() => isMobile && handleUserInteraction(user.id)}
          >
            <div className="flex w-full items-center gap-2 p-1">
              <Link href={`/brand/${user.username}`} className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/brand/${user.username}`} className="hover:underline">
                  <Tooltip content={user.name} showArrow placement="top">
                    <div className="max-w-[120px] truncate font-medium">{user.name}</div>
                  </Tooltip>
                </Link>
                <div className="truncate text-xs text-muted-foreground">
                  {user.followerCount} {user.followerCount === 1 ? "follower" : "followers"}
                </div>
              </div>

              {/* Mobile Follow Button - Always visible on mobile */}
              {isMobile && (
                <Button
                  variant="solid"
                  color="warning"
                  size="sm"
                  className="ml-auto"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFollow(user.id);
                  }}
                >
                  <IconUserPlus size={16} className="mr-1" />
                  Follow
                </Button>
              )}
            </div>

            {/* Desktop Hover Overlay */}
            {!isMobile && (
              <div
                className={`absolute inset-0 flex items-center justify-center rounded-lg bg-content1/90 transition-opacity ${
                  activeUser === user.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <Button
                  variant="solid"
                  color="warning"
                  size="sm"
                  className="absolute inset-0 h-full w-full rounded-lg text-base"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFollow(user.id);
                  }}
                >
                  <IconUserPlus size={18} className="mr-2" />
                  Follow
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onOpenChange={() => setIsLoginModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}
