"use client";

import { documentation, social } from "@/lib/links";
import Link from "next/link";
import { Button } from "../Button";
import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Dynamic import for the shader component to prevent SSR issues
const ColorPanels = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.ColorPanels),
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

  return (
    <div className="w-full">
      <section className="border-t border-slate-200 dark:border-slate-900 overflow-hidden flex flex-col relative">
        {/* Global Vertical Lines */}
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        <div className="px-4 md:px-12 w-full flex flex-col relative">
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-b border-x border-slate-200 dark:border-slate-900 relative z-20 bg-white dark:bg-slate-950" />

          {/* Background color layer */}
          <div className="absolute inset-y-0 left-4 md:left-12 right-4 md:right-12 bg-white dark:bg-slate-950 -z-20" />

          {/* Side-by-Side Container */}
          <div className="relative flex flex-col lg:flex-row items-center justify-between border-x border-slate-200 dark:border-slate-900 flex-grow">
            {/* Left Content (Text) */}
            <div className="relative flex flex-col items-center lg:items-start justify-center py-12 lg:py-24 text-center lg:text-left px-6 lg:pl-12 lg:pr-6 w-full lg:w-1/2 z-20">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl leading-[1.1]">
                Elastic-quality search <br className="hidden sm:block" />{" "}
                without the <CropHighlight>complexity</CropHighlight>
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8 justify-center lg:justify-start">
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

            {/* Right Content (Visual) */}
            <div className="relative w-full lg:w-1/2 z-10 border-t lg:border-t-0 border-slate-200 dark:border-slate-900 min-h-[400px] lg:min-h-[500px]">
              <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <div className="w-full h-full opacity-100 dark:opacity-70">
                  {mounted && (
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
                      density={3}
                      angle1={0}
                      angle2={0}
                      length={1.1}
                      edges={false}
                      blur={0}
                      fadeIn={1}
                      fadeOut={0.3}
                      gradient={0}
                      speed={0.5}
                      scale={0.8}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-t border-x border-slate-200 dark:border-slate-900 relative z-20 bg-white dark:bg-slate-950" />
        </div>
      </section>
    </div>
  );
}
