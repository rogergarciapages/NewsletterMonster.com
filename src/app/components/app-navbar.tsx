"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link as NextUILink,
} from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";

export default function AppNavbar() {
  console.log("RENDERING THE FIXED NAVBAR WITH LOGIN MODAL");
  const router = useRouter();
  const { data: session, status, update } = useSession();

  // Type assertion for status to help TypeScript understand the possible values
  const sessionStatus = status as "loading" | "authenticated" | "unauthenticated";

  // Memoize the profile image URL to prevent unnecessary re-renders
  const profileImageUrl = useMemo(
    () => session?.user?.profile_photo,
    [session?.user?.profile_photo]
  );

  // Memoize the session refresh function
  const forceSessionRefresh = useCallback(async () => {
    if (sessionStatus !== "authenticated") return;

    try {
      await update({ force: true });
      console.log("Session forcefully refreshed");
    } catch (error) {
      console.error("Failed to refresh session:", error);
    }
  }, [sessionStatus, update]);

  // Only refresh session once when component mounts and user is authenticated
  useEffect(() => {
    let mounted = true;

    if (sessionStatus === "authenticated" && mounted) {
      forceSessionRefresh();
    }

    return () => {
      mounted = false;
    };
  }, [sessionStatus, forceSessionRefresh]);

  // Debug session data
  console.log("Navbar session data:", {
    user: session?.user,
    status,
    profilePhoto: session?.user?.profile_photo,
  });

  // Memoize the URL correction function
  const ensureCorrectImageUrl = useCallback(
    (url: string | null): string | null => {
      if (!url) {
        console.log("No profile image URL provided");
        return null;
      }

      // Add cache-busting query parameter to force reload
      const sessionTimestamp = session?.expires ? new Date(session.expires).getTime() : Date.now();
      const addCacheBuster = (imgUrl: string) => {
        const hasQuery = imgUrl.includes("?");
        return `${imgUrl}${hasQuery ? "&" : "?"}t=${sessionTimestamp}`;
      };

      // Handle Google profile images directly
      if (url.includes("googleusercontent.com")) {
        console.log("Using Google profile image:", url);
        return addCacheBuster(url);
      }

      // Handle LinkedIn, GitHub, and other external provider images directly
      if (
        url.includes("linkedin.com") ||
        url.includes("githubusercontent.com") ||
        !url.includes("/userpics/")
      ) {
        console.log("Using external provider image:", url);
        return addCacheBuster(url);
      }

      if (url.includes("/userpics/public/")) {
        console.log("URL already in correct format:", url);
        return addCacheBuster(url);
      }

      const match = url.match(/\/([a-f0-9-]+)\/([a-f0-9-]+)(-\d+)?\.(jpg|jpeg|png|webp|gif)$/i);
      if (match) {
        const userId = match[1];
        const extension = match[4].toLowerCase();
        const minioEndpoint = url.split("/userpics")[0];
        const correctedUrl = `${minioEndpoint}/userpics/public/${userId}/${userId}.${extension}`;
        console.log("Original URL:", url);
        console.log("Corrected URL:", correctedUrl);
        return addCacheBuster(correctedUrl);
      }
      console.log("Failed to correct URL:", url);
      return addCacheBuster(url);
    },
    [session?.expires]
  );

  // Memoize the sign out handler
  const handleSignOut = useCallback(async () => {
    const { signOut } = await import("next-auth/react");
    await signOut({ callbackUrl: "/" });
  }, []);

  // Memoize the profile navigation handler
  const handleProfileNavigation = useCallback(() => {
    if (session?.user?.username) {
      router.push(`/user/${session.user.username}`);
    } else if (session?.user?.user_id) {
      router.push(`/user/${session.user.user_id}/edit`);
    }
  }, [router, session?.user?.username, session?.user?.user_id]);

  return (
    <>
      <Navbar>
        <NavbarBrand>
          <a href="/" className="font-bold text-inherit">
            Newsletter Monster
          </a>
        </NavbarBrand>

        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          <NavbarItem>
            <NextUILink href="/" aria-current="page">
              Home
            </NextUILink>
          </NavbarItem>
          <NavbarItem>
            <NextUILink href="/tag">Topics</NextUILink>
          </NavbarItem>
          <NavbarItem>
            <NextUILink href="/trending">Trending</NextUILink>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          {sessionStatus === "loading" ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-default-100"></div>
          ) : sessionStatus === "authenticated" && session?.user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform hover:scale-105"
                  src={(profileImageUrl && ensureCorrectImageUrl(profileImageUrl)) || undefined}
                  name={session.user.name?.charAt(0).toUpperCase() || "R"}
                  showFallback
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-500">
                      {session.user.name?.charAt(0).toUpperCase() || "R"}
                    </div>
                  }
                  imgProps={{
                    onError: () => {
                      console.error("Avatar image failed to load");
                      forceSessionRefresh();
                    },
                  }}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" onClick={handleProfileNavigation}>
                  Your Profile
                </DropdownItem>
                <DropdownItem key="refresh-session" onClick={forceSessionRefresh}>
                  Refresh Session
                </DropdownItem>
                <DropdownItem
                  key="bookmarks"
                  onClick={() => {
                    if (session.user.username) {
                      router.push(`/user/${session.user.username}/bookmarks`);
                    } else {
                      router.push(`/user/${session.user.user_id}/bookmarks`);
                    }
                  }}
                >
                  Bookmarks
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={handleSignOut}>
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              color="warning"
              onClick={() => {
                console.log("Sign In button clicked");
                signIn();
              }}
              variant="flat"
              className="text-inherit"
            >
              Sign In
            </Button>
          )}
        </NavbarContent>
      </Navbar>
    </>
  );
}
