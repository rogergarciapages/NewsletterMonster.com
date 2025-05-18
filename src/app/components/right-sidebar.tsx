// src/app/components/right-sidebar.tsx
"use client";

import NextLink from "next/dist/client/link";

import PopularTags from "@/app/components/tags/popular-tags";

import AdvertisementBanner from "./sidebar/advertisement-banner";
import WhoToFollow from "./who-to-follow";

// src/app/components/right-sidebar.tsx

// src/app/components/right-sidebar.tsx

// src/app/components/right-sidebar.tsx

// src/app/components/right-sidebar.tsx

// src/app/components/right-sidebar.tsx

// src/app/components/right-sidebar.tsx

// src/app/components/right-sidebar.tsx

// src/app/components/right-sidebar.tsx

// src/app/components/right-sidebar.tsx

// src/app/components/right-sidebar.tsx

const RightSidebar = () => {
  return (
    <div className="w-full bg-background">
      <div className="sticky top-16 flex flex-col gap-6 p-4">
        <WhoToFollow />
        <AdvertisementBanner tall />

        {/* Tags section */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">Popular Tags</h3>
          <PopularTags />
        </section>

        {/* Trends section */}
        <section>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Trends for you</h3>
          <div className="mt-4 grid gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <NextLink
                href="/blog/newsletter-strategy"
                className="rounded-md bg-torch-800/10 px-2 py-1 text-sm font-medium text-torch-800 transition-colors hover:bg-torch-800/20 dark:bg-torch-800/20 dark:text-torch-400 dark:hover:bg-torch-800/30"
                prefetch={false}
              >
                #newsletters
              </NextLink>
              <div className="truncate text-sm text-gray-700 dark:text-muted-foreground">
                Trending in Marketing
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <NextLink
                href="/blog/email-marketing"
                className="rounded-md bg-torch-800/10 px-2 py-1 text-sm font-medium text-torch-800 transition-colors hover:bg-torch-800/20 dark:bg-torch-800/20 dark:text-torch-400 dark:hover:bg-torch-800/30"
                prefetch={false}
              >
                #emailmarketing
              </NextLink>
              <div className="truncate text-sm text-gray-700 dark:text-muted-foreground">
                Trending in Business
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <NextLink
                href="/blog/content-creation"
                className="rounded-md bg-torch-800/10 px-2 py-1 text-sm font-medium text-torch-800 transition-colors hover:bg-torch-800/20 dark:bg-torch-800/20 dark:text-torch-400 dark:hover:bg-torch-800/30"
                prefetch={false}
              >
                #contentcreation
              </NextLink>
              <div className="truncate text-sm text-gray-700 dark:text-muted-foreground">
                Trending in Digital
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RightSidebar;
