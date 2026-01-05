"use client";

import { documentation, social } from "@/lib/links";
import Link from "next/link";
import { Button } from "../Button";
import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Dynamic import for the shader component to prevent SSR issues
const Dithering = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.Dithering),
  { ssr: false }
);

const CropHighlight = ({ children }: { children: React.ReactNode }) => (
  <span className="relative inline-block px-1">
    <span className="absolute -inset-1 border-2 border-indigo-500 dark:border-indigo-400 pointer-events-none bg-indigo-100/80 dark:bg-indigo-500/20">
      {/* Corner Handles */}
      <span className="absolute -top-1 -left-1 size-1.5 bg-white dark:bg-slate-900 border border-indigo-500 dark:border-indigo-400" />
      <span className="absolute -top-1 -right-1 size-1.5 bg-white dark:bg-slate-900 border border-indigo-500 dark:border-indigo-400" />
      <span className="absolute -bottom-1 -left-1 size-1.5 bg-white dark:bg-slate-900 border border-indigo-500 dark:border-indigo-400" />
      <span className="absolute -bottom-1 -right-1 size-1.5 bg-white dark:bg-slate-900 border border-indigo-500 dark:border-indigo-400" />
    </span>
    {/* Cursor icon - Positioned slightly offset from the handle corner */}
    <span className="absolute top-full left-full translate-x-[2px] translate-y-[2px] sm:translate-x-[4px] sm:translate-y-[4px] pointer-events-none drop-shadow-xl z-20">
      <svg
        className="w-5 h-5 sm:w-7 sm:h-7"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 3L9 20L12 12L20 9L3 3Z"
          fill="transparent"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </span>
    <span className="relative z-10 text-indigo-600 dark:text-indigo-300">
      {children}
    </span>
  </span>
);

export default function PreFooterCta() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const bgColor = resolvedTheme === "dark" ? "#020617" : "#ffffff";
  const waveColor = resolvedTheme === "dark" ? "#1e293b" : "#f1f5f9";

  return (
    <div className="w-full">
      <section className="border-t border-slate-200 dark:border-slate-900 overflow-hidden flex flex-col relative">
        {/* Global Vertical Lines */}
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        <div className="px-4 md:px-12 w-full flex flex-col relative">
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-b border-x border-slate-200 dark:border-slate-900 relative z-20 bg-white dark:bg-slate-950" />

          {/* Background color layer */}
          <div className="absolute inset-0 bg-white dark:bg-slate-950 -z-20" />

          <div className="relative flex flex-col items-center justify-center pt-8 md:pt-24 pb-4 md:pb-8 text-center">
            <div className="relative z-20 flex flex-col items-center px-6 sm:px-0">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl leading-[1.1] text-center">
                Elastic-quality search <br className="hidden sm:block" />{" "}
                without the <CropHighlight>complexity</CropHighlight>
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
                <Button
                  asChild
                  className="text-md px-4 bg-indigo-600 ring-2 ring-indigo-400 dark:ring-indigo-600/50 border-1 border-indigo-400 dark:border-indigo-600 rounded-none h-10 text-white font-semibold shadow-none"
                >
                  <Link
                    href={social.CALENDLY}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book a Demo
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="text-md hover:group hover:bg-transparent bg-transparent border-0 h-10 px-4 dark:hover:bg-transparent"
                >
                  <Link
                    href={documentation.BASE}
                    className="text-indigo-900 dark:text-indigo-300 flex items-center gap-2"
                    target="_blank"
                  >
                    Documentation
                    <ArrowAnimated
                      className="stroke-indigo-900 dark:stroke-indigo-300"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Dither wave upright at the bottom, matching hero style */}
          <div className="relative w-full h-[120px] md:h-[180px] flex items-center justify-center overflow-hidden border-x border-slate-200 dark:border-slate-900">
            {mounted && (
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
                  rotation={0}
                />
              </div>
            )}
          </div>

          <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-t border-x border-slate-200 dark:border-slate-900 relative z-20 bg-white dark:bg-slate-950" />
        </div>
      </section>
    </div>
  );
}
