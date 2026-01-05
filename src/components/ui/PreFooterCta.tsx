"use client";

import { documentation, social } from "@/lib/links";
import Link from "next/link";
import { Button } from "../Button";
import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import { GridBackground } from "./GridBackground";

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
  return (
    <div className="w-full">
      <section className="border-t border-slate-200 dark:border-slate-900 overflow-hidden flex flex-col relative">
        {/* Global Vertical Lines */}
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        <div className="px-4 md:px-12 w-full flex flex-col relative">
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-b border-x border-slate-200 dark:border-slate-900 relative z-20 bg-white dark:bg-slate-950" />

          {/* Grid Background */}
          <div className="absolute inset-0 top-8 md:top-12 bottom-8 md:bottom-12 left-4 md:left-12 right-4 md:right-12 -z-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            <GridBackground />
          </div>

          {/* Background color layer */}
          <div className="absolute inset-0 bg-white dark:bg-slate-950 -z-20" />

          {/* Bottom fade to white/black */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 via-white/60 dark:via-slate-950/60 to-transparent z-0 pointer-events-none" />
          {/* Side fades to white/black */}
          <div className="absolute top-0 bottom-0 left-0 w-24 md:w-60 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-0 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 md:w-60 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-0 pointer-events-none" />

          <div className="relative flex flex-col items-center justify-center py-8 md:py-24 text-center">
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
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-t border-x border-slate-200 dark:border-slate-900 relative z-20 bg-white dark:bg-slate-950" />
        </div>
      </section>
    </div>
  );
}
