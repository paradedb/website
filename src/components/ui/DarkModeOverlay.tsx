"use client";

import { useTheme } from "next-themes";

export function DarkModeOverlay() {
  const { resolvedTheme } = useTheme();
  if (resolvedTheme !== "dark") return null;
  return <div className="absolute inset-0 bg-black/5 pointer-events-none" />;
}
