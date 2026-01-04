"use client";

import { HeroDemo } from "./HeroDemo";
import type { ThemedToken } from "shiki";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import Image from "next/image";

export function HeroVisual({
  lightTokens,
  darkTokens,
  code,
}: {
  lightTokens: ThemedToken[][];
  darkTokens: ThemedToken[][];
  code: string;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const meshSrc = mounted && resolvedTheme === "dark" ? "/mesh_dark.svg" : "/mesh.svg";

  return (
    <div className="relative w-full overflow-hidden">
      {/* Colorful Band Section */}
      <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950">
        {/* Colorful Background Image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={meshSrc}
            alt="Colorful gradient background"
            fill
            className="object-cover opacity-90"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[900px] px-6 md:px-12">
          <div className="overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/40 dark:border-slate-800/60">
            <HeroDemo
              lightTokens={lightTokens}
              darkTokens={darkTokens}
              code={code}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

