"use client";

import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import {
  IconBell,
  IconBookmark,
  IconHome,
  IconList,
  IconMessageCircle2,
  IconMovie,
  IconTrendingUp,
  IconUser
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

const LeftSidebar: React.FC = () => {
  useTheme();
  const { data: session } = useSession();

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  const menuItems = [
    { icon: IconHome, label: "Feed", path: "/dashboard/userfeed" },
    { icon: IconUser, label: "Profile", path: `/user/user-profile/${session?.user?.user_id}` },
    { icon: IconMessageCircle2, label: "Messages", path: "/dashboard/messages" },
    { icon: IconList, label: "Lists", path: "/dashboard/lists" },
    { icon: IconTrendingUp, label: "Trending", path: "/dashboard/trending" },
    { icon: IconBell, label: "Notifications", path: "#" },
    { icon: IconBookmark, label: "Bookmarks", path: "#" },
    { icon: IconMovie, label: "Cinema Mode!", path: "#" },
  ];

  const renderMenuItem = (item: typeof menuItems[0]) => (
    <Button
      key={item.label}
      variant="light"
      className="w-full justify-start"
      onClick={() => handleNavigation(item.path)}
      startContent={<item.icon className="h-4 w-4" />}
    >
      {item.label}
    </Button>
  );

  return (
    <div className="w-full lg:w-1/5 p-6 bg-background">
      <div className="sticky top-0 flex flex-col gap-6">
        <nav className="grid gap-2">
          <div className="block lg:hidden">
            <Accordion>
              <AccordionItem key="1" aria-label="Menu" title="Menu">
                {menuItems.map(renderMenuItem)}
              </AccordionItem>
            </Accordion>
          </div>

          <div className="hidden lg:block">
            {menuItems.map(renderMenuItem)}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default LeftSidebar;