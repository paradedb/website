"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import for the shader component to prevent SSR issues
const Dithering = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.Dithering),
  { ssr: false }
);

export function HeroVisual() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const bgColor = resolvedTheme === "dark" ? "#020617" : "#ffffff";
  const waveColor = resolvedTheme === "dark" ? "#1e293b" : "#f1f5f9";

  return (
    <div className="relative w-full overflow-hidden bg-white dark:bg-slate-950 px-4 md:px-12">
      <div className="relative w-full h-[120px] md:h-[180px] flex items-center justify-center overflow-hidden border-x border-slate-200 dark:border-slate-900">
        {/* Paper Dithering Background */}
        <div className="absolute inset-0 pointer-events-none opacity-80 dark:opacity-40">
          <Dithering
            width="100%"
            height="100%"
            colorBack={bgColor}
            colorFront={waveColor}
            shape="wave"
            type="8x8"
            size={8}
            speed={0.25}
            scale={1.4}
          />
        </div>
      </div>
    </div>
  );
}
