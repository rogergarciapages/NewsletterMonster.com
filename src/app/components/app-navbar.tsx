"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

  // Force session update when component mounts to get latest profile image
  useEffect(() => {
    // Define a function to force a hard refresh of the session
    const forceSessionRefresh = async () => {
      try {
        // Call the NextAuth update method to refresh session data
        await update({ force: true });
        console.log("Session forcefully refreshed");
      } catch (error) {
        console.error("Failed to refresh session:", error);
      }
    };

    // Only refresh if the user is authenticated
    if (sessionStatus === "authenticated") {
      forceSessionRefresh();
    }
  }, [sessionStatus, update]);

  // Debug session data
  console.log("Navbar session data:", session?.user);
  console.log("Profile photo URL:", session?.user?.profile_photo);

  // Create a direct reference to the profile image for debugging
  const profileImageUrl = session?.user?.profile_photo;

  // Utility function to ensure profile image URL has the correct structure
  const ensureCorrectImageUrl = (url: string | null): string | null => {
    if (!url) {
      console.log("No profile image URL provided");
      return null;
    }

    // Add cache-busting query parameter to force reload
    // Use a stable timestamp for the session to avoid excessive reloads
    const sessionTimestamp = session?.expires ? new Date(session.expires).getTime() : Date.now();
    const addCacheBuster = (imgUrl: string) => {
      const hasQuery = imgUrl.includes("?");
      return `${imgUrl}${hasQuery ? "&" : "?"}t=${sessionTimestamp}`;
    };

    // Handle LinkedIn, GitHub, and other external provider images directly
    if (
      url.includes("linkedin.com") ||
      url.includes("googleusercontent.com") ||
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
  };

  const handleSignOut = async () => {
    // Import dynamically to avoid server component issues
    const { signOut } = await import("next-auth/react");
    await signOut({ callbackUrl: "/" });
  };

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
                  src={profileImageUrl ? `${ensureCorrectImageUrl(profileImageUrl)}` : ""}
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
                      // Force session update on error
                      update({ force: true });
                    },
                  }}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  onClick={() => {
                    if (session.user.username) {
                      router.push(`/user/${session.user.username}`);
                    } else {
                      router.push(`/user/${session.user.user_id}/edit`);
                    }
                  }}
                >
                  Your Profile
                </DropdownItem>
                <DropdownItem
                  key="refresh-session"
                  onClick={async () => {
                    await update({ force: true });
                    console.log("Session manually refreshed");
                  }}
                >
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
