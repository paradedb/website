"use client";

import { RiComputerLine, RiMoonLine, RiSunLine } from "@remixicon/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import classNames from "classnames";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[34px] w-[100px] shrink-0" />
    );
  }

  const options = [
    { value: "system", icon: RiComputerLine },
    { value: "light", icon: RiSunLine },
    { value: "dark", icon: RiMoonLine },
  ] as const;

  return (
    <div className="flex items-center gap-0.5 rounded-full bg-slate-100/80 dark:bg-slate-900/80 p-0.5 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={classNames(
              "flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200",
              isActive
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            )}
            aria-label={`Set ${option.value} theme`}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}

