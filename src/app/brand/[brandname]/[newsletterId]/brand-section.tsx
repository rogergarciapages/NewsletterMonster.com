"use client";

import Image from "next/image";
import Link from "next/link";

import FollowerCount from "@/app/components/brand/profile/follower-count";
import FollowButton from "@/app/components/brand/profile/header/follow-button";
import { BookmarkButton } from "@/app/components/newsletters/bookmark-button";
import { DownloadButton } from "@/app/components/newsletters/download-button";
import { LikeButton } from "@/app/components/newsletters/like-button";
import { ShareButton } from "@/app/components/newsletters/share-button";
import { YouRockButton } from "@/app/components/newsletters/you-rock-button";

interface BrandSectionProps {
  brandId: string;
  brandDisplayName: string;
  brandLogo: string | null;
  followerCount: number;
  isFollowing: boolean;
  newsletterId: number;
  initialLikesCount: number;
  initialYouRocksCount: number;
  initialIsLiked: boolean;
  initialIsBookmarked: boolean;
  fullScreenshotUrl: string | null;
  htmlFileUrl: string | null;
  currentUrl: string;
  subject: string | null;
  brandname: string;
}

export default function BrandSection({
  brandId,
  brandDisplayName,
  brandLogo,
  followerCount,
  isFollowing,
  newsletterId,
  initialLikesCount,
  initialYouRocksCount,
  initialIsLiked,
  initialIsBookmarked,
  fullScreenshotUrl,
  htmlFileUrl,
  currentUrl,
  subject,
  brandname,
}: BrandSectionProps) {
  return (
    <div className="mb-6 rounded-xl bg-gray-100 p-6 shadow-sm dark:bg-zinc-900 dark:shadow-none">
      {/* Top row: Channel info (profile picture, name, follower count) */}
      <div className="mb-4 flex items-center gap-4">
        <Link href={`/brand/${brandname}`} className="shrink-0">
          {brandLogo ? (
            <Image
              src={brandLogo}
              alt={brandDisplayName}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover transition-all hover:opacity-90"
              priority
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-lg font-bold uppercase text-gray-700 dark:bg-zinc-700 dark:text-white">
              {brandDisplayName.charAt(0)}
            </div>
          )}
        </Link>
        <div>
          <Link
            href={`/brand/${brandname}`}
            className="text-lg font-semibold text-gray-800 hover:text-primary dark:text-gray-200"
          >
            {brandDisplayName}
          </Link>
          <FollowerCount brandId={brandId} initialFollowersCount={followerCount} />
        </div>

        <FollowButton brandId={brandId} isFollowing={isFollowing} className="ml-4" />
      </div>

      {/* Bottom row: Action buttons */}
      <div className="flex flex-wrap items-center gap-1">
        <LikeButton
          newsletterId={newsletterId}
          initialLikesCount={initialLikesCount}
          initialIsLiked={initialIsLiked}
          size="md"
          className="min-w-[90px] rounded-full bg-gray-200 px-3 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        />
        <YouRockButton
          newsletterId={newsletterId}
          initialYouRocksCount={initialYouRocksCount}
          size="md"
          className="min-w-[90px] rounded-full bg-gray-200 px-3 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        />
        <ShareButton
          newsletterId={newsletterId}
          url={currentUrl}
          title={subject || "Check out this newsletter"}
          size="md"
          className="min-w-[90px] rounded-full bg-gray-200 px-3 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        />
        <BookmarkButton
          newsletterId={newsletterId}
          initialIsBookmarked={initialIsBookmarked}
          size="md"
          className="min-w-[90px] rounded-full bg-gray-200 px-3 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        />
        <DownloadButton
          newsletterId={newsletterId}
          fullScreenshotUrl={fullScreenshotUrl}
          htmlFileUrl={htmlFileUrl}
          size="md"
          className="min-w-[90px] rounded-full bg-gray-200 px-3 hover:bg-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        />
      </div>
    </div>
  );
}
