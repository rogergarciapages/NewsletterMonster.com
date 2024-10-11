"use client";

import { cn } from "@/lib/utils";
import { AvatarIcon, Avatar as NextAvatar } from "@nextui-org/react"; // Correct import from NextUI
import * as React from "react";

type AvatarProps = React.ComponentPropsWithoutRef<typeof NextAvatar>;

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, ...props }, ref) => (
    <NextAvatar
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  )
);

Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  )
);

AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
      {...props}
    >
      <AvatarIcon />
    </div>
  )
);

AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarFallback, AvatarImage };

