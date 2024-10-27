// src/app/components/right-sidebar.tsx
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../../assets/avatar";
import { Plusicon } from "../../assets/svg";

const RightSidebar = () => {
  return (
    <div className="w-full bg-background">
      <div className="flex flex-col gap-6 p-4"> {/* Reduced padding */}
        {/* Who to follow section */}
        <section>
          <h3 className="text-lg font-bold">Who to follow</h3>
          <div className="mt-4 grid gap-4">
            <div className="flex items-center gap-2 min-w-0"> {/* Added min-w-0 to prevent overflow */}
              <Avatar className="h-10 w-10 flex-shrink-0"> {/* Added flex-shrink-0 */}
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1"> {/* Added min-w-0 and flex-1 */}
                <div className="font-medium truncate">Sarah Johnson</div>
                <div className="text-sm text-muted-foreground truncate">@sarahjohnsonn</div>
              </div>
              <Button
                variant="ghost"
                size="sm" // Changed to sm
                className="ml-auto flex-shrink-0" // Added flex-shrink-0
              >
                <Plusicon className="h-4 w-4" /> {/* Reduced icon size */}
              </Button>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>MB</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">Michael Brown</div>
                <div className="text-sm text-muted-foreground truncate">@michaelbrown</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto flex-shrink-0"
              >
                <Plusicon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>ED</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">Emily Davis</div>
                <div className="text-sm text-muted-foreground truncate">@emilydavis</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto flex-shrink-0"
              >
                <Plusicon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Trends section */}
        <section>
          <h3 className="text-lg font-bold">Trends for you</h3>
          <div className="mt-4 grid gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="#"
                className="rounded-md bg-primary px-2 py-1 text-sm text-accent-foreground"
                prefetch={false}
              >
                #coding
              </Link>
              <div className="text-sm text-muted-foreground truncate">Trending in Technology</div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="#"
                className="rounded-md bg-primary px-2 py-1 text-sm text-accent-foreground"
                prefetch={false}
              >
                #foodie
              </Link>
              <div className="text-sm text-muted-foreground truncate">Trending in Lifestyle</div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="#"
                className="rounded-md bg-primary px-2 py-1 text-sm text-accent-foreground"
                prefetch={false}
              >
                #travel
              </Link>
              <div className="text-sm text-muted-foreground truncate">Trending in Travel</div>
            </div>
          </div>
        </section>

        {/* Tags section */}
        <section>
          <h3 className="text-lg font-bold">Tags</h3>
          <div className="mt-4 grid gap-4">
            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="rounded-md bg-primary px-2 py-1 text-sm text-accent-foreground"
                prefetch={false}
              >
                #coding
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="rounded-md bg-primary px-2 py-1 text-sm text-accent-foreground"
                prefetch={false}
              >
                #webdev
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="rounded-md bg-primary px-2 py-1 text-sm text-accent-foreground"
                prefetch={false}
              >
                #react
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RightSidebar;