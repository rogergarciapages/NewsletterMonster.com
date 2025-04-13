"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { useDisclosure } from "@nextui-org/react";
import { IconDownload, IconExternalLink } from "@tabler/icons-react";
import { useSession } from "next-auth/react";

import LoginModal from "@/app/components/login-modal";

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
  brandname?: string;
};

export default function EmailContent({
  summary,
  fullScreenshotUrl,
  htmlFileUrl,
  subject,
  tags,
  productsLink,
  brandname,
}: EmailContentProps) {
  const { data: session, status } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [downloadType, setDownloadType] = useState<"html" | "image" | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showScreenshot, setShowScreenshot] = useState(true);
  const [iframeHeight, setIframeHeight] = useState(1200);
  const _router = useRouter();

  const isLoggedIn = status === "authenticated" && !!session;

  const handleDownload = (type: "html" | "image") => {
    if (!isLoggedIn) {
      setDownloadType(type);
      onOpen();
      return;
    }

    // User is logged in, proceed with download
    if (type === "html" && htmlFileUrl) {
      window.open(htmlFileUrl, "_blank");
    } else if (type === "image" && fullScreenshotUrl) {
      window.open(fullScreenshotUrl, "_blank");
    }
  };

  const handleLoginSuccess = () => {
    onOpenChange();
    // After successful login, attempt the download again
    if (downloadType === "html" && htmlFileUrl) {
      window.open(htmlFileUrl, "_blank");
    } else if (downloadType === "image" && fullScreenshotUrl) {
      window.open(fullScreenshotUrl, "_blank");
    }
    setDownloadType(null);
  };

  // Format brand name for display (capitalize words, replace hyphens with spaces)
  const formattedBrandName = brandname
    ? brandname
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "this brand";

  return (
    <div className="flex flex-col gap-6 bg-white p-6 dark:bg-zinc-900">
      {/* Login Modal */}
      <LoginModal isOpen={isOpen} onOpenChange={onOpenChange} onSuccess={handleLoginSuccess} />

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
          <>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              See the HTML of {subject || "this newsletter"}
            </h2>
            <div className="overflow-hidden rounded-lg border-0 shadow-none">
              <iframe
                src={htmlFileUrl}
                className="h-[800px] w-full"
                title={subject || "Newsletter content"}
              />
            </div>
            <div className="mt-4">
              <h2 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                Download Options for {subject || "this newsletter"}
              </h2>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Save this newsletter for offline viewing. You can download the HTML version to view
                in your browser or the full image for easy sharing.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleDownload("html")}
                  className="inline-flex items-center gap-2 rounded-lg bg-warning px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-warning-600"
                >
                  <IconDownload className="h-4 w-4" />
                  Download HTML
                </button>
                {fullScreenshotUrl && (
                  <button
                    onClick={() => handleDownload("image")}
                    className="inline-flex items-center gap-2 rounded-lg bg-torch-700 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-torch-800"
                  >
                    <IconDownload className="h-4 w-4" />
                    Download Image
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Products link */}
        {productsLink && (
          <div className="mt-6">
            <h2 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
              Want to find more offers from {formattedBrandName}?
            </h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Click the button below to explore exclusive deals, special promotions, and featured
              products from {formattedBrandName}. Discover the latest collections and best offers
              available right now.
            </p>
            <div className="flex items-center">
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
          </div>
        )}
      </div>
    </div>
  );
}
