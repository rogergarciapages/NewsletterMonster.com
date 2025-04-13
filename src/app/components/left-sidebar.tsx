"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Accordion, AccordionItem, Button, Chip, Tooltip } from "@nextui-org/react";
import {
  IconAlertCircle,
  IconBell,
  IconBookmark,
  IconCompass,
  IconHome,
  IconMessageCircle2,
  IconMovie,
  IconTag,
  IconTrendingUp,
  IconUser,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

import { useBookmarkCount } from "@/hooks/use-bookmark-count";

import LoginModal from "./login-modal";

// src/app/components/left-sidebar.tsx

interface MenuItem {
  icon: typeof IconHome;
  label: string;
  path: string;
  requiresAuth?: boolean;
  badge?: number;
  needsProfileCompletion?: boolean;
  tooltip?: string;
}

// Cache key for local storage
const USERNAME_CACHE_KEY = "user_profile_complete";
const USERNAME_CACHE_EXPIRY = "user_profile_check_expiry";
// Cache for 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const LeftSidebar: React.FC = () => {
  useTheme();
  const router = useRouter();
  const { data: session } = useSession();
  const { count: bookmarkCount } = useBookmarkCount();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [lastAttemptedPath, setLastAttemptedPath] = useState<string | null>(null);
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);
  const [actualUsername, setActualUsername] = useState<string | null>(null);

  // Check if user needs to complete profile
  useEffect(() => {
    if (!session?.user?.user_id) {
      return;
    }

    const userId = session.user.user_id;

    // Check if we have a cached result
    const checkCache = () => {
      if (typeof window === "undefined") return false;

      try {
        const cachedUserId = localStorage.getItem(`${USERNAME_CACHE_KEY}_${userId}`);
        const cacheExpiry = localStorage.getItem(`${USERNAME_CACHE_EXPIRY}_${userId}`);

        if (cachedUserId && cacheExpiry) {
          const expiry = parseInt(cacheExpiry, 10);
          const now = Date.now();

          // If cache is still valid
          if (now < expiry) {
            // If cachedUserId is "true", it means user has a username
            if (cachedUserId === "true") {
              return true;
            }
            // If "false", user needs to complete profile
            else if (cachedUserId === "false") {
              setNeedsProfileCompletion(true);
              return true;
            }
          }
        }
        return false;
      } catch (e) {
        return false;
      }
    };

    // If cached result exists and is valid, use it
    if (checkCache()) {
      return;
    }

    // If user already has username in session, we're done
    if (session.user.username) {
      try {
        // Cache this result
        localStorage.setItem(`${USERNAME_CACHE_KEY}_${userId}`, "true");
        localStorage.setItem(
          `${USERNAME_CACHE_EXPIRY}_${userId}`,
          (Date.now() + CACHE_DURATION).toString()
        );
      } catch (e) {
        // Ignore storage errors
      }
      return;
    }

    // Otherwise check the database only if we don't have a username in session
    const checkActualUsername = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);

        if (response.ok) {
          const userData = await response.json();

          // If user has a username in the database
          if (userData.username) {
            setActualUsername(userData.username);
            try {
              // Cache this result
              localStorage.setItem(`${USERNAME_CACHE_KEY}_${userId}`, "true");
              localStorage.setItem(
                `${USERNAME_CACHE_EXPIRY}_${userId}`,
                (Date.now() + CACHE_DURATION).toString()
              );
            } catch (e) {
              // Ignore storage errors
            }
          } else {
            // User doesn't have a username
            setNeedsProfileCompletion(true);
            try {
              // Cache this result
              localStorage.setItem(`${USERNAME_CACHE_KEY}_${userId}`, "false");
              localStorage.setItem(
                `${USERNAME_CACHE_EXPIRY}_${userId}`,
                (Date.now() + CACHE_DURATION).toString()
              );
            } catch (e) {
              // Ignore storage errors
            }
          }
        }
      } catch (error) {
        console.error("Error checking username:", error);
      }
    };

    checkActualUsername();
  }, [session?.user]);

  const menuItems: MenuItem[] = [
    {
      icon: needsProfileCompletion ? IconAlertCircle : IconUser,
      label: needsProfileCompletion ? "Complete your Profile" : "Profile",
      path: session?.user
        ? session.user.username
          ? `/user/${session.user.username}`
          : actualUsername
            ? `/user/${actualUsername}`
            : `/user/${session.user.user_id}/edit`
        : "#",
      requiresAuth: true,
      needsProfileCompletion,
      tooltip: needsProfileCompletion
        ? "Please visit your profile and complete your profile setup"
        : undefined,
    },
    { icon: IconMessageCircle2, label: "Messages", path: "#" },
    { icon: IconTag, label: "Tags", path: "/tag" },
    { icon: IconCompass, label: "Explore", path: "/newsletters/explore" },
    { icon: IconTrendingUp, label: "Trending", path: "/trending" },
    { icon: IconBell, label: "Notifications", path: "#" },
    {
      icon: IconBookmark,
      label: "Bookmarks",
      path: session?.user
        ? session.user.username
          ? `/user/${session.user.username}/bookmarks`
          : actualUsername
            ? `/user/${actualUsername}/bookmarks`
            : `/user/${session.user.user_id}/bookmarks`
        : "#",
      requiresAuth: true,
      badge: bookmarkCount,
    },
    { icon: IconMovie, label: "Cinema Mode!", path: "#" },
  ];

  const handleNavigation = (item: MenuItem) => {
    if (item.requiresAuth && !session) {
      setLastAttemptedPath(item.path);
      setIsLoginModalOpen(true);
      return;
    }

    if (item.path === "#") {
      return;
    }

    router.push(item.path as never);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    if (lastAttemptedPath && lastAttemptedPath !== "#") {
      router.push(lastAttemptedPath as never);
      setLastAttemptedPath(null);
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const button = (
      <Button
        key={item.label}
        variant="light"
        className={`w-full justify-start ${item.needsProfileCompletion ? "bg-warning-50 dark:bg-warning-900/20" : ""}`}
        onClick={() => handleNavigation(item)}
        startContent={
          <item.icon className={`h-6 w-6 ${item.needsProfileCompletion ? "text-warning" : ""}`} />
        }
        endContent={
          item.badge ? (
            <Chip size="sm" color="success" variant="flat" className="ml-auto">
              {item.badge}
            </Chip>
          ) : null
        }
      >
        {item.label}
      </Button>
    );

    return item.tooltip ? (
      <Tooltip
        key={item.label}
        content={item.tooltip}
        placement="right"
        delay={300}
        closeDelay={0}
        classNames={{
          base: "py-2 px-4 shadow-xl rounded-lg",
          content: "text-sm font-medium text-default-900",
        }}
      >
        {button}
      </Tooltip>
    ) : (
      button
    );
  };

  return (
    <>
      <div className="w-full bg-background">
        <div className="flex flex-col gap-6">
          <nav className="grid gap-2">
            <div className="block lg:hidden">
              <Accordion>
                <AccordionItem key="1" aria-label="Menu" title="Menu">
                  {menuItems.map((item, index) => (
                    <div key={index}>{renderMenuItem(item)}</div>
                  ))}
                </AccordionItem>
              </Accordion>
            </div>

            <div className="hidden lg:block">
              {menuItems.map((item, index) => (
                <div key={index}>{renderMenuItem(item)}</div>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onOpenChange={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default LeftSidebar;
