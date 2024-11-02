import { Link, NavbarItem } from "@nextui-org/react";
import { memo } from "react";
import { MENU_ITEMS } from "../constants";
import { MenuItemsProps } from "../types";

const MenuItems = memo(({ className }: MenuItemsProps) => (
  <>
    {MENU_ITEMS.map((item) => (
      <NavbarItem key={item.label}>
        <Link 
          className={className}
          href={item.href} 
          size="md"
        >
          {item.label}
        </Link>
      </NavbarItem>
    ))}
  </>
));
MenuItems.displayName = "MenuItems";

export default MenuItems;