"use client";

import { BookmarkButton } from "../../newsletters/bookmark-button";
import { DownloadButton } from "../../newsletters/download-button";
import { LikeButton } from "../../newsletters/like-button";
import { ShareButton } from "../../newsletters/share-button";
import { YouRockButton } from "../../newsletters/you-rock-button";

type EmailToolbarProps = {
  currentUrl?: string;
  subject?: string | null;
  _summary?: string | null;
  newsletterId: number;
  initialLikesCount?: number;
  initialYouRocksCount?: number;
  initialIsLiked?: boolean;
  initialIsBookmarked?: boolean;
  fullScreenshotUrl?: string | null;
  htmlFileUrl?: string | null;
};

export default function EmailToolbar({
  currentUrl,
  subject,
  _summary,
  newsletterId,
  initialLikesCount = 0,
  initialYouRocksCount = 0,
  initialIsLiked = false,
  initialIsBookmarked = false,
  fullScreenshotUrl,
  htmlFileUrl,
}: EmailToolbarProps) {
  // YouTube-like styling for buttons
  const buttonClassName =
    "min-w-[90px] px-3 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700";

  return (
    <div className="mb-4 flex items-center justify-start rounded-xl bg-gray-100 px-4 py-2.5 shadow-sm dark:bg-zinc-900 dark:shadow-none">
      <div className="flex flex-wrap items-center gap-1">
        <LikeButton
          newsletterId={newsletterId}
          initialLikesCount={initialLikesCount}
          initialIsLiked={initialIsLiked}
          size="md"
          className={buttonClassName}
        />
        <YouRockButton
          newsletterId={newsletterId}
          initialYouRocksCount={initialYouRocksCount}
          size="md"
          className={buttonClassName}
        />
        <ShareButton
          newsletterId={newsletterId}
          size="md"
          url={currentUrl}
          title={subject || "Check out this newsletter on NewsletterMonster"}
          className={buttonClassName}
        />
        <BookmarkButton
          newsletterId={newsletterId}
          initialIsBookmarked={initialIsBookmarked}
          size="md"
          className={buttonClassName}
        />
        <DownloadButton
          newsletterId={newsletterId}
          fullScreenshotUrl={fullScreenshotUrl}
          htmlFileUrl={htmlFileUrl}
          size="md"
          className={buttonClassName}
        />
      </div>
    </div>
  );
}
