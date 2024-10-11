"use client";

import {
  Avatar,
  Button,
  CircularProgress,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { IconUser } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";

interface AuthButtonProps {
  onOpenLoginModal: () => void;
}

export default function AuthButton({ onOpenLoginModal }: AuthButtonProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <CircularProgress aria-label="Loading authentication status..." />;
  }

  if (status === "authenticated") {
    const signOutClick = () => signOut({ callbackUrl: "/" });

    console.log("Session User:", session.user);

    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            showFallback={!session.user.profile_photo}
            src={session.user.profile_photo || ""}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as:</p>
            <p className="font-semibold">{session.user.email}</p>
          </DropdownItem>
          <DropdownItem key="sign-out" color="danger" onClick={signOutClick}>
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <Button onClick={onOpenLoginModal} color="warning" variant="shadow">
      <IconUser />
      Sign In
    </Button>
  );
}
