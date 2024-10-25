import { IconHandLoveYou, IconHeartFilled } from "@tabler/icons-react";

interface NewsletterStatsProps {
  likes: number | null;
  youRocks: number | null;
  createdAt: Date | null;
}

export default function NewsletterStats({ 
  likes, 
  youRocks, 
  createdAt 
}: NewsletterStatsProps) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-2 pb-2">
      <div className="flex items-center gap-3">
        {likes !== null && (
          <div className="flex items-center gap-1.5">
            <IconHeartFilled size={24} className="text-torch-700" />
            <span className="font-medium text-medium text-gray-900 dark:text-white/80">
              {likes}
            </span>
          </div>
        )}
        {youRocks !== null && (
          <div className="flex items-center gap-1.5">
            <IconHandLoveYou size={24} strokeWidth={2} className="text-gray-900 dark:text-white" />
            <span className="font-medium text-medium text-gray-900 dark:text-white/80">
              {youRocks}
            </span>
          </div>
        )}
      </div>
      {createdAt && (
        <time 
          dateTime={createdAt.toISOString()}
          className="text-zinc-500"
        >
          {new Date(createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })}
        </time>
      )}
    </div>
  );
}