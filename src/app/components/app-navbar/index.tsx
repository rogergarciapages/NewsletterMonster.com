"use client";

import {
  Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, useDisclosure
} from "@nextui-org/react";
import { IconPackage } from "@tabler/icons-react";
import React from "react";
import LoginModal from "../login-modal"; // Ensure to import the LoginModal
import AuthButton from "./auth-button";
import { ThemeSwitcher } from "./theme-switcher";

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/profile" },
    { label: "Guestbook", href: "/guestbook" }
  ];

  return (
    <>
      <Navbar onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden" />
          <NavbarBrand>
            <IconPackage />
            <p className="font-bold text-inherit">Next.js Starter</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          {menuItems.map((item, index) => (
            <NavbarItem key={`${item}-${index}`}>
              <Link className="w-full" href={item.href} size="lg">
                {item.label}
              </Link>
            </NavbarItem>
          ))}
          <NavbarItem>
            <ThemeSwitcher />
          </NavbarItem>
          <NavbarItem>
            <AuthButton minimal={false} onOpenLoginModal={onOpen} />
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          <NavbarMenuItem>
            <ThemeSwitcher showLabel />
          </NavbarMenuItem>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
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
