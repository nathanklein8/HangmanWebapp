"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, SunMoon } from "lucide-react";
import { Button } from "./ui/button";

const ModeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (<Button variant="outline" size="icon"><SunMoon /></Button>)
  }
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

export default ModeToggle;