export interface NavItem {
    label: string;
    href: string;
  }
  
  export interface Session {
    user: {
      email: string;
      profile_photo?: string;
    };
  }
  
  export interface AuthButtonProps {
    onOpenLoginModal: () => void;
  }
  
  export interface MenuItemsProps {
    className?: string;
  }
  
  export interface MobileMenuProps {
    onOpenLoginModal: () => void;
  }