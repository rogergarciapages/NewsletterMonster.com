"use client";

import { Button, Tooltip } from "@nextui-org/react";
import {
  IconArchive,
  IconBookmark,
  IconHeart,
  IconMail,
  IconMailForward,
  IconPrinter,
  IconShare,
  IconTrash,
} from "@tabler/icons-react";

type EmailToolbarProps = {
  onShare?: () => void;
  onPrint?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onBookmark?: () => void;
  onLike?: () => void;
  likesCount?: number;
  isLiked?: boolean;
  currentUrl?: string;
  subject?: string | null;
  summary?: string | null;
};

export default function EmailToolbar({
  onShare,
  onPrint,
  onArchive,
  onDelete,
  onBookmark,
  onLike,
  likesCount = 0,
  isLiked = false,
  currentUrl,
  subject,
  summary,
}: EmailToolbarProps) {
  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator
        .share({
          title: subject || "Newsletter",
          text: summary || "Check out this newsletter",
          url: currentUrl,
        })
        .catch(console.error);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 px-4 py-2 backdrop-blur-sm dark:bg-zinc-900/80">
      <div className="flex items-center gap-2">
        <Tooltip content="Reply">
          <Button isIconOnly variant="light" size="sm" aria-label="Reply">
            <IconMail className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Forward">
          <Button isIconOnly variant="light" size="sm" aria-label="Forward">
            <IconMailForward className="h-4 w-4" />
          </Button>
        </Tooltip>

        <div className="mx-2 h-4 w-px bg-gray-300 dark:bg-gray-700" />

        <Tooltip content="Archive">
          <Button isIconOnly variant="light" size="sm" aria-label="Archive" onClick={onArchive}>
            <IconArchive className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Delete">
          <Button isIconOnly variant="light" size="sm" aria-label="Delete" onClick={onDelete}>
            <IconTrash className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip content={isLiked ? "Unlike" : "Like"}>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            aria-label={isLiked ? "Unlike" : "Like"}
            onClick={onLike}
            className={isLiked ? "text-torch-600" : ""}
          >
            <div className="flex items-center">
              <IconHeart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
              {likesCount > 0 && <span className="ml-1 text-xs">{likesCount}</span>}
            </div>
          </Button>
        </Tooltip>

        <Tooltip content="Bookmark">
          <Button isIconOnly variant="light" size="sm" aria-label="Bookmark" onClick={onBookmark}>
            <IconBookmark className="h-4 w-4" />
          </Button>
        </Tooltip>

        <div className="mx-2 h-4 w-px bg-gray-300 dark:bg-gray-700" />

        <Tooltip content="Share">
          <Button isIconOnly variant="light" size="sm" aria-label="Share" onClick={handleShare}>
            <IconShare className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Print">
          <Button isIconOnly variant="light" size="sm" aria-label="Print" onClick={handlePrint}>
            <IconPrinter className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
