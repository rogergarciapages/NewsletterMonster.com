import { IconHandLoveYou, IconHeartFilled } from "@tabler/icons-react";

interface NewsletterStatsProps {
  likes: number | null;
  youRocks: number | null;
  createdAt: Date | string | null;
}

export default function NewsletterStats({ likes, youRocks, createdAt }: NewsletterStatsProps) {
  const dateObject = createdAt ? new Date(createdAt) : null;

  return (
    <div className="flex items-center justify-between border-t pb-2 pt-2 text-sm text-gray-500">
      <div className="flex items-center gap-3">
        {likes !== null && (
          <div className="flex items-center gap-1.5">
            <IconHeartFilled size={24} className="text-torch-700" />
            <span className="text-medium font-medium text-gray-900 dark:text-white/80">
              {likes}
            </span>
          </div>
        )}
        {youRocks !== null && (
          <div className="flex items-center gap-1.5">
            <IconHandLoveYou size={24} strokeWidth={2} className="text-gray-900 dark:text-white" />
            <span className="text-medium font-medium text-gray-900 dark:text-white/80">
              {youRocks}
            </span>
          </div>
        )}
      </div>
      {dateObject && (
        <time dateTime={dateObject.toISOString()} className="text-zinc-500">
          {dateObject.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </time>
      )}
    </div>
  );
}
