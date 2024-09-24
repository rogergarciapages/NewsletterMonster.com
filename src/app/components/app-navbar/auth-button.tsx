"use client";

import { Button, CircularProgress } from "@nextui-org/react";
import { IconUser } from "@tabler/icons-react";
import { useSession } from "next-auth/react";

export default function AuthButton({ onOpenLoginModal }) {
  const { status } = useSession();

  if (status === "loading") {
    return <CircularProgress aria-label="Loading authentication status..." />;
  }

  if (status === "authenticated") {
    return null; // Hide the button if the user is authenticated
  }

  return (
    <Button onClick={onOpenLoginModal} color="warning" variant="shadow">
        <IconUser />
      Sign In
    </Button>
  );
}
