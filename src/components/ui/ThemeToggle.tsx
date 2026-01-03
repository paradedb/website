"use client";

import { RiMoonLine, RiSunLine } from "@remixicon/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../Button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="light"
        size="icon"
        className="size-9 shrink-0 opacity-0"
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="light"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="size-9 shrink-0 text-indigo-900 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-0"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <RiSunLine className="size-5" />
      ) : (
        <RiMoonLine className="size-5" />
      )}
    </Button>
  );
}

