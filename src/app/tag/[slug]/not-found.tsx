"use client";

import NextLink from "next/dist/client/link";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";

export default function TagNotFound() {
  return (
    <ThreeColumnLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="mb-4 text-4xl font-bold">Tag Not Found</h1>
        <p className="mb-8 text-gray-600">
          The tag you're looking for doesn't exist or has been removed.
        </p>
        <NextLink
          href="/trending"
          className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Browse Trending Newsletters
        </NextLink>
      </div>
    </ThreeColumnLayout>
  );
}
