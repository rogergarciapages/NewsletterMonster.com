"use client";

import { Button, Tooltip } from "@nextui-org/react";
import { IconBookmark } from "@tabler/icons-react";

import { LikeButton } from "../../newsletters/like-button";
import { ShareButton } from "../../newsletters/share-button";
import { YouRockButton } from "../../newsletters/you-rock-button";

type EmailToolbarProps = {
  onBookmark?: () => void;
  currentUrl?: string;
  subject?: string | null;
  summary?: string | null;
  newsletterId: number;
  initialLikesCount?: number;
  initialYouRocksCount?: number;
};

export default function EmailToolbar({
  onBookmark,
  currentUrl,
  subject,
  summary,
  newsletterId,
  initialLikesCount = 0,
  initialYouRocksCount = 0,
}: EmailToolbarProps) {
  const buttonClassName = "min-w-[110px] h-10 hover:bg-default-100";
  const iconButtonClassName = "h-10 w-10 hover:bg-default-100";

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between bg-white/80 px-4 py-2.5 backdrop-blur-sm dark:bg-zinc-900/80">
      <div className="flex items-center gap-3">
        <LikeButton
          newsletterId={newsletterId}
          initialLikesCount={initialLikesCount}
          size="md"
          className={buttonClassName}
        />
        <YouRockButton
          newsletterId={newsletterId}
          initialYouRocksCount={initialYouRocksCount}
          size="md"
          className={buttonClassName}
        />
      </div>

      <div className="flex items-center gap-3">
        <Tooltip content="Bookmark">
          <Button
            isIconOnly
            variant="light"
            size="md"
            aria-label="Bookmark"
            onClick={onBookmark}
            className={iconButtonClassName}
          >
            <IconBookmark className="h-5 w-5 text-default-500" />
          </Button>
        </Tooltip>

        <ShareButton
          newsletterId={newsletterId}
          size="md"
          url={currentUrl}
          title={subject || "Check out this newsletter on NewsletterMonster"}
          className={iconButtonClassName}
        />
      </div>
    </div>
  );
}
