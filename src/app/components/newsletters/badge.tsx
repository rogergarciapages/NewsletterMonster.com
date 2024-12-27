"use client";

import { Badge as BadgeType } from "@prisma/client";
import { IconAward, IconHandStop, IconHeart } from "@tabler/icons-react";
import { format } from "date-fns";

interface BadgeProps {
  badge: BadgeType;
  showDate?: boolean;
  size?: "sm" | "md" | "lg";
}

const RANK_COLORS = {
  FIRST: "text-yellow-500",
  SECOND: "text-gray-400",
  THIRD: "text-amber-600",
};

const CATEGORY_LABELS = {
  DAY: "of the Day",
  WEEK: "of the Week",
  MONTH: "of the Month",
};

const TYPE_ICONS = {
  LIKE: IconHeart,
  YOU_ROCK: IconHandStop,
};

export function Badge({ badge, showDate = false, size = "md" }: BadgeProps) {
  const Icon = TYPE_ICONS[badge.type];
  const rankColor = RANK_COLORS[badge.rank];
  const categoryLabel = CATEGORY_LABELS[badge.category];

  const sizeClasses = {
    sm: "text-xs gap-1",
    md: "text-sm gap-1.5",
    lg: "text-base gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full bg-gray-100 px-3 py-1 font-medium dark:bg-gray-800 ${sizeClasses[size]}`}
    >
      <IconAward className={`${iconSizes[size]} ${rankColor}`} />
      <Icon className={iconSizes[size]} />
      <span>
        {badge.rank === "FIRST" ? "#1" : badge.rank === "SECOND" ? "#2" : "#3"} {categoryLabel}
      </span>
      {showDate && (
        <span className="ml-1 text-gray-500">{format(badge.earned_at, "MMM d, yyyy")}</span>
      )}
    </div>
  );
}
