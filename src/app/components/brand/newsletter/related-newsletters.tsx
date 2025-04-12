"use client";

import Image from "next/image";
import Link from "next/link";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";

// Format a date in a short, readable format (e.g., "Jan 15, 2023")
function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

interface Newsletter {
  id: string;
  brandName: string;
  subject: string;
  createdAt: Date;
  likesCount: number;
  screenshot?: string | null;
}

interface RelatedNewslettersProps {
  title: string;
  newsletters: Newsletter[];
}

export function RelatedNewsletters({ title, newsletters }: RelatedNewslettersProps) {
  if (!newsletters || newsletters.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {newsletters.map(newsletter => (
          <Link
            href={`/brand/${newsletter.brandName}/${newsletter.id}`}
            key={newsletter.id}
            className="no-underline"
          >
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="h-40 overflow-hidden bg-gray-100 p-0">
                {newsletter.screenshot ? (
                  <Image
                    src={newsletter.screenshot}
                    alt={newsletter.subject}
                    width={400}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200">
                    <span className="text-gray-500">No preview</span>
                  </div>
                )}
              </CardHeader>
              <CardBody className="p-3">
                <h3 className="text-md line-clamp-2 font-semibold">{newsletter.subject}</h3>
              </CardBody>
              <CardFooter className="flex justify-between p-3 pt-0 text-sm text-gray-500">
                <span>{newsletter.likesCount} likes</span>
                <span>{formatDateShort(new Date(newsletter.createdAt))}</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
