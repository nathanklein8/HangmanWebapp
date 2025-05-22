"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline" size="icon"
      onClick={() => {
        const newTheme = resolvedTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        document.cookie = `theme=${newTheme}; path=/`;
      }}
    >
      {resolvedTheme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
};

export default ThemeToggle;