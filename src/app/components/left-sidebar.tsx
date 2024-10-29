// src/app/components/left-sidebar.tsx
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginModal from "./login-modal";

interface MenuItem {
  icon: typeof IconHome;
  label: string;
  path: string;
  requiresAuth?: boolean;
}

const LeftSidebar: React.FC = () => {
  useTheme();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [lastAttemptedPath, setLastAttemptedPath] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { 
      icon: IconUser, 
      label: "Profile", 
      path: session?.user?.user_id ? `/user/${session.user.user_id}` : "#",
      requiresAuth: true 
    },
    { icon: IconMessageCircle2, label: "Messages", path: "#" },
    { icon: IconList, label: "Lists", path: "#" },
    { icon: IconTrendingUp, label: "Trending", path: "/trending" },
    { icon: IconBell, label: "Notifications", path: "#" },
    { icon: IconBookmark, label: "Bookmarks", path: "#" },
    { icon: IconMovie, label: "Cinema Mode!", path: "#" },
  ];

  const handleNavigation = (item: MenuItem) => {
    if (item.requiresAuth && !session) {
      setLastAttemptedPath(item.path);
      setIsLoginModalOpen(true);
      return;
    }

    if (item.path === "#") {
      return;
    }

    router.push(item.path as never); 
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    if (lastAttemptedPath && lastAttemptedPath !== "#") {
      router.push(lastAttemptedPath as never); 
      setLastAttemptedPath(null);
    }
  };

  const renderMenuItem = (item: MenuItem) => (
    <Button
      key={item.label}
      variant="light"
      className="w-full justify-start"
      onClick={() => handleNavigation(item)}
      startContent={<item.icon className="h-4 w-4" />}
    >
      {item.label}
    </Button>
  );

  return (
    <>
      <div className="w-full bg-background">
        <div className="flex flex-col gap-6">
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

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onOpenChange={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default LeftSidebar;