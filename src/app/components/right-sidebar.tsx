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

const TrendsForYou = () => (
  <section>
    <h3 className="text-lg font-bold">Trends for you</h3>
    <div className="mt-4 grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <NextLink
          href="#"
          className="rounded-md bg-primary/80 px-2 py-1 text-sm text-accent-foreground transition-colors hover:bg-primary"
          prefetch={false}
        >
          #coding
        </NextLink>
        <div className="truncate text-sm text-muted-foreground">Trending in Technology</div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <NextLink
          href="#"
          className="rounded-md bg-primary px-2 py-1 text-sm text-accent-foreground"
          prefetch={false}
        >
          #foodie
        </NextLink>
        <div className="truncate text-sm text-muted-foreground">Trending in Lifestyle</div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <NextLink
          href="#"
          className="rounded-md bg-primary px-2 py-1 text-sm text-accent-foreground"
          prefetch={false}
        >
          #travel
        </NextLink>
        <div className="truncate text-sm text-muted-foreground">Trending in Travel</div>
      </div>
    </div>
  </section>
);

const RightSidebar = () => {
  return (
    <div className="w-full bg-background">
      <div className="flex flex-col gap-6 p-2">
        <WhoToFollow />
        <div className="sticky top-0 z-10 flex flex-col gap-6">
          <AdvertisementBanner tall />
          {/* Tags section */}
          <section>
            <h3 className="mb-4 text-lg font-bold">Popular Tags</h3>
            <PopularTags />
          </section>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
