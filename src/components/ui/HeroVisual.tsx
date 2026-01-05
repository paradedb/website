"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import for the shader component to prevent SSR issues
const ColorPanels = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.ColorPanels),
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

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      <div className="w-full h-full">
        <ColorPanels
          width="100%"
          height="100%"
          colors={[
            "#ff9d00",
            "#fd4f30",
            "#809bff",
            "#6d2eff",
            "#333aff",
            "#f15cff",
            "#ffd557",
          ]}
          colorBack={bgColor}
          density={1.6}
          angle1={0.3}
          angle2={0.3}
          length={1}
          edges={true}
          blur={0.25}
          fadeIn={0.85}
          fadeOut={0.3}
          gradient={0}
          speed={1}
          rotation={112}
          scale={0.8}
        />
      </div>
    </div>
  );
}
