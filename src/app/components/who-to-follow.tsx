"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button, Tooltip } from "@nextui-org/react";
import { IconLoader2, IconUserPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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

// Cache duration - 30 minutes
const CACHE_DURATION = 30 * 60 * 1000;
const SUGGESTED_USERS_CACHE_KEY = "suggested_users_cache";
const SUGGESTED_USERS_CACHE_EXPIRY = "suggested_users_expiry";

export default function WhoToFollow() {
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isLarge = useMediaQuery("(min-width: 1024px)");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingFollow, setLoadingFollow] = useState<Record<string, boolean>>({});
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [backupUsers, setBackupUsers] = useState<SuggestedUser[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { data: session } = useSession();

  // Use this to track brands we've already seen to avoid duplicates
  const [seenBrandIds, setSeenBrandIds] = useState<Set<string>>(new Set());

  const fetchSuggestedUsers = async (limit = 10) => {
    try {
      // Check if we have valid cached data
      if (typeof window !== "undefined") {
        try {
          const cachedUsers = localStorage.getItem(SUGGESTED_USERS_CACHE_KEY);
          const cacheExpiry = localStorage.getItem(SUGGESTED_USERS_CACHE_EXPIRY);

          if (cachedUsers && cacheExpiry) {
            const now = Date.now();
            const expiry = parseInt(cacheExpiry, 10);

            if (now < expiry) {
              // Cache is still valid
              const parsedUsers = JSON.parse(cachedUsers);

              // Filter out brands we've already seen
              const filteredData = parsedUsers.filter(
                (user: SuggestedUser) => !seenBrandIds.has(user.id)
              );

              // If we have enough users after filtering, use them
              if (filteredData.length >= 3) {
                // Split the data
                const displayUsers = filteredData.slice(0, 3);
                const backup = filteredData.slice(3);

                setSuggestedUsers(displayUsers);
                setBackupUsers(backup);
                setIsLoading(false);
                return;
              }
              // If not enough users after filtering, continue to API call
            }
          }
        } catch (e) {
          // Continue with API call if localStorage fails
          console.error("Error accessing localStorage:", e);
        }
      }

      setIsLoading(true);
      const response = await fetch(`/api/users/popular?limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          // Filter out brands we've already seen
          const filteredData = data.filter((user: SuggestedUser) => !seenBrandIds.has(user.id));

          // Add these brand ids to the seen set
          const newSeenIds = new Set(seenBrandIds);
          filteredData.forEach((user: SuggestedUser) => newSeenIds.add(user.id));
          setSeenBrandIds(newSeenIds);

          // Split the data into displayed and backup users
          const displayUsers = filteredData.slice(0, 3);
          const backup = filteredData.slice(3);

          setSuggestedUsers(displayUsers);
          setBackupUsers(backup);

          // Update cache
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(SUGGESTED_USERS_CACHE_KEY, JSON.stringify(filteredData));
              localStorage.setItem(
                SUGGESTED_USERS_CACHE_EXPIRY,
                (Date.now() + CACHE_DURATION).toString()
              );
            } catch (e) {
              // Ignore localStorage errors
              console.error("Error storing in localStorage:", e);
            }
          }
        } else {
          setFallbackData();
        }
      } else {
        console.error("Failed to fetch popular users");
        setFallbackData();
      }
    } catch (error) {
      console.error("Error fetching suggested users:", error);
      setFallbackData();
    } finally {
      setIsLoading(false);
    }
  };

  const setFallbackData = () => {
    // Fallback for testing - sample brands when none are returned
    const fallbackData = [
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
      {
        id: "sample4",
        name: "Travel Digest",
        username: "travel-digest",
        avatar: "/placeholder-brand.png",
        bio: "Explore the world through our lens",
        followerCount: 92,
      },
      {
        id: "sample5",
        name: "Food Network",
        username: "food-network",
        avatar: "/placeholder-brand.png",
        bio: "Delicious recipes and cooking tips",
        followerCount: 110,
      },
    ];

    setSuggestedUsers(fallbackData.slice(0, 3));
    setBackupUsers(fallbackData.slice(3));
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, [session?.user?.user_id]); // Refetch when user changes

  const handleUserInteraction = (userId: string | null) => {
    if (isMobile) {
      setActiveUser(activeUser === userId ? null : userId);
    } else {
      setActiveUser(userId);
    }
  };

  const replaceBrand = (brandId: string) => {
    // Check if we have a backup brand
    if (backupUsers.length > 0) {
      const newBrand = backupUsers[0];
      const remainingBackups = backupUsers.slice(1);

      // Update our lists
      setSuggestedUsers(prev => prev.map(user => (user.id === brandId ? newBrand : user)));
      setBackupUsers(remainingBackups);

      // If we're running low on backups, fetch more
      if (remainingBackups.length < 2) {
        fetchSuggestedUsers();
      }
    } else {
      // If no backups, just remove the brand
      setSuggestedUsers(prev => prev.filter(user => user.id !== brandId));

      // Fetch more brands
      fetchSuggestedUsers();
    }
  };

  const handleFollow = async (brandId: string) => {
    if (!session?.user) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      // Set loading state for this specific brand
      setLoadingFollow(prev => ({ ...prev, [brandId]: true }));

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
        // Show success state briefly
        setTimeout(() => {
          // Replace the brand with a new one
          replaceBrand(brandId);

          // Clear loading state
          setLoadingFollow(prev => {
            const newState = { ...prev };
            delete newState[brandId];
            return newState;
          });

          toast.success("Successfully followed!");
        }, 500); // Show success state for half a second
      } else {
        throw new Error("Failed to follow brand");
      }
    } catch (error) {
      console.error("Error following brand:", error);
      toast.error("Failed to follow brand. Please try again.");

      // Clear loading state on error
      setLoadingFollow(prev => {
        const newState = { ...prev };
        delete newState[brandId];
        return newState;
      });
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
                  isLoading={loadingFollow[user.id]}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFollow(user.id);
                  }}
                >
                  {loadingFollow[user.id] ? (
                    <IconLoader2 size={16} className="mr-1 animate-spin" />
                  ) : (
                    <IconUserPlus size={16} className="mr-1" />
                  )}
                  {loadingFollow[user.id] ? "Following..." : "Follow"}
                </Button>
              )}
            </div>

            {/* Desktop Hover Overlay */}
            {!isMobile && (
              <div
                className={`absolute inset-0 flex items-center justify-center rounded-lg bg-content1/90 transition-opacity ${
                  activeUser === user.id || loadingFollow[user.id] ? "opacity-100" : "opacity-0"
                }`}
              >
                <Button
                  variant="solid"
                  color="warning"
                  size="sm"
                  className="absolute inset-0 h-full w-full rounded-lg text-base"
                  isLoading={loadingFollow[user.id]}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFollow(user.id);
                  }}
                >
                  {loadingFollow[user.id] ? (
                    <>
                      <IconLoader2 size={18} className="mr-2 animate-spin" />
                      Following...
                    </>
                  ) : (
                    <>
                      <IconUserPlus size={18} className="mr-2" />
                      Follow
                    </>
                  )}
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
