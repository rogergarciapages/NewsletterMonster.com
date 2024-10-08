"use client";

import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import LoginModal from "../login-modal";
import AuthButton from "./auth-button";
import { ThemeSwitcher } from "./theme-switcher";

// Import both light and dark logo components
import LogoNewsletterMonsterdark from "./logo-newsletter-monster-dark";
import LogoNewsletterMonsterlight from "./logo-newsletter-monster-light";

// Import the useTheme hook from next-themes
import { useTheme } from "next-themes";

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { theme } = useTheme(); // Access the current theme

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <Navbar onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            {/* Conditionally render logos based on the current theme */}
            {theme === "dark" ? (
              <LogoNewsletterMonsterdark />
            ) : (
              <LogoNewsletterMonsterlight />
            )}
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          {menuItems.map((item, index) => (
            <NavbarItem key={`${item.label}-${index}`}>
              <Link className="w-full" href={item.href} size="lg">
                {item.label}
              </Link>
            </NavbarItem>
          ))}
          <NavbarItem>
            <ThemeSwitcher />
          </NavbarItem>
          <NavbarItem>
            <AuthButton onOpenLoginModal={onOpen} />
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          <NavbarMenuItem>
            <ThemeSwitcher showLabel />
          </NavbarMenuItem>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <Link className="w-full" href={item.href} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem>
            <AuthButton onOpenLoginModal={onOpen} />
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      <LoginModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
