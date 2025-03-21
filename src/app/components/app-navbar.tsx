"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { useSession } from "next-auth/react";

export default function AppNavbar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    // Import dynamically to avoid server component issues
    const { signOut } = await import("next-auth/react");
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Navbar>
      <NavbarBrand>
        <Link href="/" className="font-bold text-inherit">
          Newsletter Monster
        </Link>
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
        {status === "loading" ? (
          <div className="h-10 w-10 animate-pulse rounded-full bg-default-100"></div>
        ) : status === "authenticated" && session?.user ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform hover:scale-105"
                src={session.user.profile_photo || ""}
                name={session.user.name?.charAt(0).toUpperCase()}
                showFallback
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
            onClick={() => router.push("/api/auth/signin")}
            variant="flat"
            className="text-inherit"
          >
            Sign In
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
}
