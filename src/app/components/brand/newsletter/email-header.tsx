"use client";

import Link from "next/dist/client/link";

import { Button, Tooltip } from "@nextui-org/react";
import { IconMail, IconMailForward, IconStar } from "@tabler/icons-react";

type EmailHeaderProps = {
  subject: string | null;
  sender: string | null;
  brandname: string;
  date: Date | null;
  recipientEmail?: string;
};

export default function EmailHeader({
  subject,
  sender,
  brandname,
  date,
  recipientEmail = "you@newslettermonster.com",
}: EmailHeaderProps) {
  return (
    <div className="rounded-t-lg border-b bg-white p-4 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{subject || "Untitled Newsletter"}</h1>
        <div className="flex gap-2">
          <Tooltip content="Star this newsletter">
            <Button isIconOnly variant="light" aria-label="Star">
              <IconStar className="h-5 w-5" />
            </Button>
          </Tooltip>
          <Tooltip content="Reply">
            <Button isIconOnly variant="light" aria-label="Reply">
              <IconMail className="h-5 w-5" />
            </Button>
          </Tooltip>
          <Tooltip content="Forward">
            <Button isIconOnly variant="light" aria-label="Forward">
              <IconMailForward className="h-5 w-5" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-[80px,1fr] items-center">
          <span className="text-gray-500">From:</span>
          <Link href={`/${brandname}`} className="font-medium hover:text-torch-600">
            {sender} &lt;{brandname}@newslettermonster.com&gt;
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
    </div>
  );
}
