"use client";

import { BookmarkButton } from "../../newsletters/bookmark-button";
import { LikeButton } from "../../newsletters/like-button";
import { ShareButton } from "../../newsletters/share-button";
import { YouRockButton } from "../../newsletters/you-rock-button";

type EmailToolbarProps = {
  currentUrl?: string;
  subject?: string | null;
  summary?: string | null;
  newsletterId: number;
  initialLikesCount?: number;
  initialYouRocksCount?: number;
  initialIsLiked?: boolean;
  initialIsBookmarked?: boolean;
};

export default function EmailToolbar({
  currentUrl,
  subject,
  summary,
  newsletterId,
  initialLikesCount = 0,
  initialYouRocksCount = 0,
  initialIsLiked = false,
  initialIsBookmarked = false,
}: EmailToolbarProps) {
  const buttonClassName = "min-w-[110px] h-10 hover:bg-default-100";

  return (
    <div className="sticky top-0 z-10 flex items-center justify-start bg-white/80 px-4 py-2.5 backdrop-blur-sm dark:bg-zinc-900/80">
      <div className="flex items-center gap-3">
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
        <BookmarkButton
          newsletterId={newsletterId}
          initialIsBookmarked={initialIsBookmarked}
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
      </div>
    </div>
  );
}
