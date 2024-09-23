"use client";

import { Avatar, Button, CircularProgress, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { IconUser } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";

interface AuthButtonProps {
  minimal?: boolean;
  onOpenLoginModal?: () => void; // Add this prop
}

const AuthButton: React.FC<AuthButtonProps> = ({ minimal = true, onOpenLoginModal }) => {
  const { data, status } = useSession();

  if (status === "loading") {
    return <CircularProgress aria-label="Loading authentication status..." />;
  }

  if (status === "authenticated") {
    const signOutClick = () => signOut({ callbackUrl: "/" });
    if (minimal) {
      return (
        <Button onClick={signOutClick} color="warning" variant="solid">
          <IconUser />
          Sign Out
        </Button>
      );
    }

    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            showFallback={!data.user?.image}
            src={data.user?.image || ""}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{data.user?.email}</p>
          </DropdownItem>
          <DropdownItem key="sign-out" color="danger" onClick={signOutClick}>
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <Button onClick={onOpenLoginModal} color="warning" variant="solid">
      <IconUser />
      Sign In
    </Button>
  );
};

export default AuthButton;
