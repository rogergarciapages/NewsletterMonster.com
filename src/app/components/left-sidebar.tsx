"use client";

import { Bookmarkicon, Cinemamode, Homeicon, Listicon, Messageempty, Notificationicon, Trendingicon, Usersicon } from "@/assets/svg";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import AccordionItem from "./Accordion";

const LeftSidebar: React.FC = () => {
  useTheme();
  const { data: session } = useSession();

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="w-full lg:w-1/5 p-6 dark:bg-[#222]">
      <div className="sticky top-0 flex flex-col gap-6">
        <nav className="grid gap-2">
          <div className="block w-full md:hidden">
            <AccordionItem title="Menu">
              <button onClick={() => handleNavigation("/dashboard/userfeed")} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w-full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
                <Homeicon className="h-8 w-8" />
                Feed
              </button>
              <button onClick={() => handleNavigation(`/user/user-profile/${session?.user?.id}`)} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w-full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
                <Usersicon className="h-8 w-8" />
                Profile
              </button>
              <button onClick={() => handleNavigation("/dashboard/messages")} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w/full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
                <Messageempty className="h-8 w-8" />
                Messages
              </button>
              <button onClick={() => handleNavigation("/dashboard/lists")} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w/full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
                <Listicon className="h-8 w-8" />
                Lists
              </button>
              <button onClick={() => handleNavigation("/dashboard/trending")} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w/full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
                <Trendingicon className="h-8 w-8" />
                Trending
              </button>
              <button onClick={() => handleNavigation("#")} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w/full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
                <Notificationicon className="h-8 w-8" />
                Notifications
              </button>
              <button onClick={() => handleNavigation("#")} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w/full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
                <Bookmarkicon className="h-8 w-8" />
                Bookmarks
              </button>
              <button onClick={() => handleNavigation("#")} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w/full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
                <Cinemamode className="h-8 w-8" />
                Cinema Mode!
              </button>
            </AccordionItem>
          </div>

          <div className="hidden md:block">
            <button onClick={() => handleNavigation("/dashboard/userfeed")} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w/full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
              <Homeicon className="h-8 w-8" />
              Home Feed
            </button>
            <button onClick={() => handleNavigation(`/user/edit-profile/${session?.user?.id}`)} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w/full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
              <Usersicon className="h-8 w-8" />
              Profile
            </button>
            <button onClick={() => handleNavigation("/dashboard/messages")} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w/full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
              <Messageempty className="h-8 w-8" />
              Messages
            </button>
            <button onClick={() => handleNavigation("/dashboard/lists")} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w/full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
              <Listicon className="h-8 w-8" />
              Lists
            </button>
            <button onClick={() => handleNavigation("/dashboard/trending")} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w/full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
              <Trendingicon className="h-8 w-8" />
              Trending
            </button>
            <button onClick={() => handleNavigation("#")} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w/full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
              <Notificationicon className="h-8 w-8" />
              Notifications
            </button>
            <button onClick={() => handleNavigation("#")} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w/full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
              <Bookmarkicon className="h-8 w-8" />
              Bookmarks
            </button>
            <button onClick={() => handleNavigation("#")} className="flex items-center gap-2 rounded-md transition-all duration-500 ease-in-out px-3 py-2 w/full text-left text-[#222] dark:text-white hover:bg-primary hover:text-[#ffffff]">
              <Cinemamode className="h-8 w-8" />
              Cinema Mode!
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default LeftSidebar;
