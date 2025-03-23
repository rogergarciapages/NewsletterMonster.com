// src/app/components/app-navbar/auth-button.tsx
"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";

import {
  Avatar,
  Button,
  CircularProgress,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { IconLock, IconLogout, IconUser } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";

// src/app/components/app-navbar/auth-button.tsx

// src/app/components/app-navbar/auth-button.tsx

// src/app/components/app-navbar/auth-button.tsx

// src/app/components/app-navbar/auth-button.tsx

// src/app/components/app-navbar/auth-button.tsx

// src/app/components/app-navbar/auth-button.tsx

// src/app/components/app-navbar/auth-button.tsx

// src/app/components/app-navbar/auth-button.tsx

// src/app/components/app-navbar/auth-button.tsx

// src/app/components/app-navbar/auth-button.tsx

// src/app/components/app-navbar/auth-button.tsx

// src/app/components/app-navbar/auth-button.tsx

// src/app/components/app-navbar/auth-button.tsx

// src/app/components/app-navbar/auth-button.tsx

// src/app/components/app-navbar/auth-button.tsx

// src/app/components/app-navbar/auth-button.tsx

interface AuthButtonProps {
  onOpenLoginModal: () => void;
}

// Utility function to ensure profile image URL has the correct structure
const ensureCorrectImageUrl = (url: string | null): string | null => {
  if (!url) return null;
  if (url.includes("/userpics/public/")) return url;

  const match = url.match(/\/([a-f0-9-]+)\/([a-f0-9-]+)(-\d+)?\.(jpg|jpeg|png|webp|gif)$/i);
  if (match) {
    const userId = match[1];
    const extension = match[4].toLowerCase();
    const minioEndpoint = url.split("/userpics")[0];
    return `${minioEndpoint}/userpics/public/${userId}/${userId}.${extension}`;
  }
  return url;
};

const LoadingState = memo(() => (
  <div className="flex h-10 w-10 items-center justify-center">
    <CircularProgress
      size="sm"
      aria-label="Loading authentication status..."
      classNames={{
        svg: "w-5 h-5",
      }}
    />
  </div>
));
LoadingState.displayName = "LoadingState";

interface UserDropdownProps {
  session: {
    user: {
      user_id: string;
      email: string;
      name: string;
      image?: string | null;
      profile_photo?: string | null;
      username?: string | null;
      role?: string;
    };
  };
}

const UserDropdown = memo(({ session }: UserDropdownProps) => {
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }, []);

  const handleAction = useCallback(
    (key: string | number) => {
      switch (key) {
        case "profile":
          if (session.user.username) {
            router.push(`/user/${session.user.username}`);
          } else {
            router.push(`/user/${session.user.user_id}/edit`);
          }
          break;
        case "sign-out":
          handleSignOut();
          break;
      }
    },
    [router, session.user, handleSignOut]
  );

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform hover:scale-105"
          showFallback
          src={ensureCorrectImageUrl(session.user.profile_photo || null) || ""}
          name={session.user.name?.charAt(0).toUpperCase() || "R"}
          aria-label="User menu"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat" onAction={handleAction}>
        <DropdownItem
          key="user-info"
          className="h-14"
          startContent={<IconLock className="h-4 w-4 text-default-500" />}
          description={session.user.email}
        >
          Signed in as
        </DropdownItem>
        <DropdownItem
          key="profile"
          startContent={<IconUser className="h-4 w-4" />}
          description="View and edit your profile"
        >
          Your Profile
        </DropdownItem>
        <DropdownItem
          key="sign-out"
          startContent={<IconLogout className="h-4 w-4" />}
          description="Exit your account"
          className="text-danger"
          color="danger"
        >
          Sign Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
});
UserDropdown.displayName = "UserDropdown";

const SignInButton = memo(({ onOpenLoginModal }: AuthButtonProps) => {
  return (
    <Button
      color="warning"
      onClick={() => {
        console.log("Sign In button clicked, opening modal");
        onOpenLoginModal();
      }}
      variant="flat"
      className="text-inherit"
    >
      Sign In
    </Button>
  );
});
SignInButton.displayName = "SignInButton";

function AuthButton({ onOpenLoginModal }: AuthButtonProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingState />;
  }

  if (status === "authenticated" && session?.user) {
    return <UserDropdown session={session} />;
  }

  return <SignInButton onOpenLoginModal={onOpenLoginModal} />;
}

export default memo(AuthButton);
