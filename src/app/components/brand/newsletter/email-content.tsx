import Image from "next/image";

import { IconExternalLink } from "@tabler/icons-react";

import NewsletterTags from "../../tags/newsletter-tags";

type EmailContentProps = {
  summary: string | null;
  fullScreenshotUrl: string | null;
  htmlFileUrl: string | null;
  subject: string | null;
  tags: {
    Tag: {
      id: number;
      name: string;
    };
  }[];
  productsLink: string | null;
};

export default function EmailContent({
  summary,
  fullScreenshotUrl,
  htmlFileUrl,
  subject,
  tags,
  productsLink,
}: EmailContentProps) {
  return (
    <div className="flex flex-col gap-6 bg-white p-6 dark:bg-zinc-900">
      {/* Summary section */}
      {summary && (
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-zinc-800">
          <h2 className="mb-2 text-lg font-semibold">Summary</h2>
          <p className="text-gray-700 dark:text-gray-300">{summary}</p>
        </div>
      )}

      {/* Tags section */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <NewsletterTags tags={tags} className="flex flex-wrap gap-2" />
        </div>
      )}

      {/* Main content */}
      <div className="space-y-6">
        {/* Newsletter screenshot */}
        {fullScreenshotUrl && (
          <div className="overflow-hidden rounded-lg border-0 shadow-none">
            <Image
              src={fullScreenshotUrl}
              alt={subject || "Newsletter content"}
              width={1200}
              height={800}
              className="h-auto w-full"
              priority
            />
          </div>
        )}

        {/* Newsletter HTML content */}
        {htmlFileUrl && (
          <div className="overflow-hidden rounded-lg border-0 shadow-none">
            <iframe
              src={htmlFileUrl}
              className="h-[800px] w-full"
              title={subject || "Newsletter content"}
            />
          </div>
        )}

        {/* Products link */}
        {productsLink && (
          <div className="flex items-center justify-end">
            <a
              href={productsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-torch-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-torch-700"
            >
              View Featured Products
              <IconExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
