import { NavItem } from "./types";

export const MENU_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Trending", href: "/trending" },
] as const;