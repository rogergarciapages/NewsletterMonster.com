// src/app/components/app-navbar/navbar-client.tsx
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
import NextLink from "next/link";
import { memo, useCallback, useEffect, useState } from "react";
import LoginModal from "../login-modal";
import AuthButton from "./auth-button";
import { MENU_ITEMS } from "./constants";
import LogoNewsletterMonsterdark from "./logo-newsletter-monster-dark";
import LogoNewsletterMonsterlight from "./logo-newsletter-monster-light";
import { ThemeSwitcher } from "./theme-switcher";

const NavbarClient = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isOpen: isLoginModalOpen, onOpen: onLoginModalOpen, onOpenChange: onLoginModalOpenChange } = useDisclosure();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleMenuOpenChange = useCallback((isOpen: boolean) => {
    setIsMenuOpen(isOpen);
  }, []);

  const logoClassName = `transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`;
  const itemClassName = `transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`;

  return (
    <>
      <Navbar 
        onMenuOpenChange={handleMenuOpenChange}
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
              <div className={logoClassName}>
                {(!mounted || resolvedTheme === "dark") ? (
                  <LogoNewsletterMonsterdark aria-label="NewsletterMonster Logo Dark Theme - Home" />
                ) : (
                  <LogoNewsletterMonsterlight aria-label="NewsletterMonster Logo Light Theme - Home" />
                )}
              </div>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          {MENU_ITEMS.map((item) => (
            <NavbarItem key={item.label}>
              <Link 
                className={itemClassName}
                href={item.href} 
                size="md"
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
          <NavbarItem>
            <div className={itemClassName}>
              <ThemeSwitcher />
            </div>
          </NavbarItem>
          <NavbarItem>
            <div className={itemClassName}>
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
});

NavbarClient.displayName = "NavbarClient";

export default NavbarClient;
