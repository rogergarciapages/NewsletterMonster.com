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
import { useTheme } from "next-themes";
import NextLink from "next/link"; // Import Next.js Link component
import React, { useEffect, useState } from "react";
import LoginModal from "../login-modal";
import AuthButton from "./auth-button";
import LogoNewsletterMonsterdark from "./logo-newsletter-monster-dark";
import LogoNewsletterMonsterlight from "./logo-newsletter-monster-light";
import { ThemeSwitcher } from "./theme-switcher";

const MENU_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
] as const;

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isOpen: isLoginModalOpen, onOpen: onLoginModalOpen, onOpenChange: onLoginModalOpenChange } = useDisclosure();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar 
        onMenuOpenChange={setIsMenuOpen}
        classNames={{
          base: "z-50",
        }}
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <NextLink href="/" className="cursor-pointer">
              <div 
                className={`transition-opacity duration-300 hover:opacity-80 ${
                  mounted ? "opacity-100" : "opacity-0"
                }`}
              >
                {(!mounted || resolvedTheme === "dark") ? (
                  <LogoNewsletterMonsterdark aria-label="NewsletterMonster Logo Dark Theme - Home" />
                ) : (
                  <LogoNewsletterMonsterlight aria-label="NewsletterMonster Logo Light Theme - Home" />
                )}
              </div>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        {/* Rest of the navbar content remains the same */}
        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          {MENU_ITEMS.map((item) => (
            <NavbarItem key={item.label}>
              <Link 
                className={`w-full transition-opacity duration-300 ${
                  mounted ? "opacity-100" : "opacity-0"
                }`} 
                href={item.href} 
                size="md"
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
          <NavbarItem>
            <div className={`transition-opacity duration-300 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}>
              <ThemeSwitcher />
            </div>
          </NavbarItem>
          <NavbarItem>
            <div className={`transition-opacity duration-300 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}>
              <AuthButton onOpenLoginModal={onLoginModalOpen} />
            </div>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          <NavbarMenuItem>
            <ThemeSwitcher showLabel />
          </NavbarMenuItem>
          {MENU_ITEMS.map((item) => (
            <NavbarMenuItem key={item.label}>
              <Link className="w-full" href={item.href} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem>
            <AuthButton onOpenLoginModal={onLoginModalOpen} />
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      <LoginModal isOpen={isLoginModalOpen} onOpenChange={onLoginModalOpenChange} />
    </>
  );
}