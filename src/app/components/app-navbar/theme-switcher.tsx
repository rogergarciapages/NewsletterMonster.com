"use client";

import useSystemTheme from "@/hooks/use-system-theme";
import { Switch } from "@nextui-org/react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface ThemeSwitcherProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeSwitcher({ showLabel, className }: ThemeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useSystemTheme();
  
  // Handle initial system preference
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
    setMounted(true);
  }, [setTheme]);

  if (!mounted) {
    return (
      <div className="w-12 h-6 bg-gray-200 rounded-full animate-pulse" />
    );
  }

  return (
    <Switch
      isSelected={theme === "light"}
      onValueChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      size="lg"
      color="success"
      className={`transition-all duration-200 ${className}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      startContent={
        <IconSun 
          className="w-4 h-4 text-yellow-500 transition-transform duration-200" 
          style={{
            transform: theme === "light" ? "scale(1.2)" : "scale(1)"
          }}
        />
      }
      endContent={
        <IconMoon 
          className="w-4 h-4 text-blue-500 transition-transform duration-200" 
          style={{
            transform: theme === "dark" ? "scale(1.2)" : "scale(1)"
          }}
        />
      }
    >
      {showLabel && (
        <span className="ml-2">
          {theme === "dark" ? "Dark" : "Light"} Theme
        </span>
      )}
    </Switch>
  );
}