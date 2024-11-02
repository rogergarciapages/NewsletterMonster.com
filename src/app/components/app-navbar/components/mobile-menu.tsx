import { Link, NavbarMenuItem } from "@nextui-org/react";
import { memo } from "react";
import AuthButton from "../auth-button";
import { MENU_ITEMS } from "../constants";
import { ThemeSwitcher } from "../theme-switcher";
import { MobileMenuProps } from "../types";

const MobileMenu = memo(({ onOpenLoginModal }: MobileMenuProps) => (
  <>
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
      <AuthButton onOpenLoginModal={onOpenLoginModal} />
    </NavbarMenuItem>
  </>
));
MobileMenu.displayName = "MobileMenu";

export default MobileMenu;