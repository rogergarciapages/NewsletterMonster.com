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
import { memo } from "react";

interface AuthButtonProps {
  onOpenLoginModal: () => void;
}

function AuthButton({ onOpenLoginModal }: AuthButtonProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <CircularProgress 
          size="sm"
          aria-label="Loading authentication status..." 
          classNames={{
            svg: "w-5 h-5",
          }}
        />
      </div>
    );
  }

  if (status === "authenticated" && session?.user) {
    const signOutClick = () => {
      try {
        signOut({ callbackUrl: "/" });
      } catch (error) {
        console.error("Sign out failed:", error);
        // Could add error handling UI here
      }
    };

    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform hover:scale-105"
            showFallback={!session.user.profile_photo}
            src={session.user.profile_photo || ""}
            name={session.user.email?.charAt(0).toUpperCase()} // Fallback to email initial
            aria-label="User menu"
          />
        </DropdownTrigger>
        <DropdownMenu 
          aria-label="Profile Actions" 
          variant="flat"
          onAction={(key) => {
            if (key === "sign-out") {
              signOutClick();
            }
          }}
        >
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as:</p>
            <p className="font-semibold">{session.user.email}</p>
          </DropdownItem>
          <DropdownItem 
            key="sign-out" 
            color="danger"
            className="text-danger"
          >
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <Button 
      onClick={onOpenLoginModal} 
      color="warning" 
      variant="shadow"
      startContent={<IconUser className="h-4 w-4" />}
      className="min-w-[100px]"
    >
      Sign In
    </Button>
  );
}

export default memo(AuthButton);