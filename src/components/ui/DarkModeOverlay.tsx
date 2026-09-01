"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function DarkModeOverlay() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || resolvedTheme !== "dark") return null;
  return <div className="absolute inset-0 bg-black/5 pointer-events-none" />;
}
