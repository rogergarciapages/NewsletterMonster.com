"use client";

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
  const buttonClassName = "min-w-[110px]";

  return (
    <div className="mb-4 flex items-center justify-start rounded-xl bg-zinc-800/30 px-5 py-2">
      <div className="flex flex-wrap items-center gap-2">
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
