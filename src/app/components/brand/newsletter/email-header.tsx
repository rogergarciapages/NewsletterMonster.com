"use client";

import Link from "next/dist/client/link";
import Image from "next/image";

import { Chip, Tooltip } from "@nextui-org/react";

type Badge = {
  id: string;
  type: string;
  category: string;
  rank: string;
  earned_at: Date;
};

type EmailHeaderProps = {
  subject: string | null;
  sender: string | null;
  brandname: string;
  date: Date | null;
  recipientEmail?: string;
  badges?: Badge[];
};

function getBadgeImage(type: string, category: string, rank: string): string {
  const rankNumber = rank === "FIRST" ? "1" : rank === "SECOND" ? "2" : "3";
  const categoryLetter = category === "DAY" ? "d" : category === "WEEK" ? "w" : "m";
  return `${rankNumber}${categoryLetter}.png`;
}

export default function EmailHeader({
  subject,
  sender,
  brandname,
  date,
  recipientEmail = "you@newslettermonster.com",
  badges = [],
}: EmailHeaderProps) {
  return (
    <div className="relative mt-4 rounded-t-lg bg-white p-8 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">{subject || "Untitled Newsletter"}</h1>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-[80px,1fr] items-center">
          <span className="text-gray-500">From:</span>
          <Link href={`/brand/${brandname}`} className="inline-flex items-center gap-2">
            <Chip
              as="span"
              variant="flat"
              color="primary"
              className="cursor-pointer transition-colors hover:bg-primary-100"
            >
              {sender || brandname}
            </Chip>
          </Link>
        </div>

        <div className="grid grid-cols-[80px,1fr] items-center">
          <span className="text-gray-500">To:</span>
          <span>{recipientEmail}</span>
        </div>

        {date && (
          <div className="grid grid-cols-[80px,1fr] items-center">
            <span className="text-gray-500">Date:</span>
            <time dateTime={date.toISOString()}>
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        )}
      </div>

      {/* Badges positioned in bottom right corner */}
      {badges.length > 0 && (
        <div className="absolute -bottom-10 right-8 flex gap-4">
          {badges.map(badge => (
            <Tooltip
              key={badge.id}
              content={`${badge.rank.charAt(0) + badge.rank.slice(1).toLowerCase()} place for ${badge.type === "LIKE" ? "likes" : "you rocks"} of the ${badge.category.toLowerCase()}`}
              placement="top"
            >
              <div className="relative h-[144px] w-[144px] transition-transform hover:scale-110">
                <Image
                  src={`/badges/${getBadgeImage(badge.type, badge.category, badge.rank)}`}
                  alt={`${badge.rank} ${badge.type} ${badge.category} badge`}
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}
