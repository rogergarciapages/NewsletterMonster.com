// src/app/components/right-sidebar.tsx
import Link from "next/link";

import { Button } from "@nextui-org/react";

import PopularTags from "@/app/components/tags/popular-tags";

import { Avatar, AvatarFallback, AvatarImage } from "../../assets/avatar";
import { Plusicon } from "../../assets/svg";

const RightSidebar = () => {
  return (
    <div className="w-full bg-background">
      <div className="flex flex-col gap-6 p-4">
        {" "}
        {/* Reduced padding */}
        {/* Who to follow section */}
        <section>
          <h3 className="text-lg font-bold">Who to follow</h3>
          <div className="mt-4 grid gap-4">
            <div className="flex min-w-0 items-center gap-2">
              {" "}
              {/* Added min-w-0 to prevent overflow */}
              <Avatar className="h-10 w-10 flex-shrink-0">
                {" "}
                {/* Added flex-shrink-0 */}
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                {" "}
                {/* Added min-w-0 and flex-1 */}
                <div className="truncate font-medium">Sarah Johnson</div>
                <div className="truncate text-sm text-muted-foreground">@sarahjohnsonn</div>
              </div>
              <Button
                variant="ghost"
                size="sm" // Changed to sm
                className="ml-auto flex-shrink-0" // Added flex-shrink-0
              >
                <Plusicon className="h-4 w-4" /> {/* Reduced icon size */}
              </Button>
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>MB</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">Michael Brown</div>
                <div className="truncate text-sm text-muted-foreground">@michaelbrown</div>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto flex-shrink-0">
                <Plusicon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>ED</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">Emily Davis</div>
                <div className="truncate text-sm text-muted-foreground">@emilydavis</div>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto flex-shrink-0">
                <Plusicon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        {/* Trends section */}
        <section>
          <h3 className="text-lg font-bold">Trends for you</h3>
          <div className="mt-4 grid gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="#"
                className="rounded-md bg-primary px-2 py-1 text-sm text-accent-foreground"
                prefetch={false}
              >
                #coding
              </Link>
              <div className="truncate text-sm text-muted-foreground">Trending in Technology</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="#"
                className="rounded-md bg-primary px-2 py-1 text-sm text-accent-foreground"
                prefetch={false}
              >
                #foodie
              </Link>
              <div className="truncate text-sm text-muted-foreground">Trending in Lifestyle</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="#"
                className="rounded-md bg-primary px-2 py-1 text-sm text-accent-foreground"
                prefetch={false}
              >
                #travel
              </Link>
              <div className="truncate text-sm text-muted-foreground">Trending in Travel</div>
            </div>
          </div>
        </section>
        {/* Tags section */}
        <section>
          <h3 className="text-lg font-bold">Popular Tags</h3>

          <div className="mt-4 grid gap-4">
            <div className="flex items-center gap-2">
              <PopularTags />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RightSidebar;
