import { Button } from "@nextui-org/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../../assets/avatar";
import { Plusicon } from "../../assets/svg";

const RightSidebar = () => {
  return (
    <div className="w-full lg:w-1/5 p-6">
      <div className="sticky top-[64px] grid gap-6"> {/* Adjust top value */}
        <div>
          <h3 className="text-lg font-bold">Who to follow</h3>
          <div className="mt-4 grid gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Sarah Johnson</div>
                <div className="text-sm text-muted-foreground">
                  @sarahjohnsonn
                </div>
              </div>
              <Button
                variant="ghost"
                size="md"
                className="ml-auto hover:bg-primary"
              >
                <Plusicon className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Michael Brown</div>
                <div className="text-sm text-muted-foreground">
                  @michaelbrown
                </div>
              </div>
              <Button
                variant="ghost"
                size="md"
                className="ml-auto hover:bg-primary"
              >
                <Plusicon className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Emily Davis</div>
                <div className="text-sm text-muted-foreground">
                  @emilydavis
                </div>
              </div>
              <Button
                variant="ghost"
                size="md"
                className="ml-auto hover:bg-primary"
              >
                <Plusicon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold">Trends for you</h3>
          <div className="mt-4 grid gap-4">
            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="rounded-md bg-primary px-2 py-1 text-sm text-accent-foreground"
                prefetch={false}
              >
                #coding
              </Link>
              <div className="text-sm text-muted-foreground">
                Trending in Technology
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="rounded-md bg-primary px-2 py-1 text-sm text-accent-foreground"
                prefetch={false}
              >
                #foodie
              </Link>
              <div className="text-sm text-muted-foreground">
                Trending in Lifestyle
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="rounded-md bg-primary px-2 py-1 text-sm text-accent-foreground"
                prefetch={false}
              >
                #travel
              </Link>
              <div className="text-sm text-muted-foreground">
                Trending in Travel
              </div>
            </div>
          </div>
        </div>
        <div>
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
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
