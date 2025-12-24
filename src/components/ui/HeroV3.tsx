"use client";

import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import { documentation, social } from "@/lib/links";
import Link from "next/link";
import { Button } from "../Button";
import LogoCloud from "./LogoCloud";
import { Navigation } from "@/components/ui/Navbar";
import { siteConfig } from "@/app/siteConfig";
import { HeroVisual } from "./HeroVisual";
import { GridBackground } from "@/components/ui/GridBackground";
import type { ThemedToken } from "shiki";

export default function HeroV3({
  lightTokens,
  darkTokens,
  code,
}: {
  lightTokens: ThemedToken[][];
  darkTokens: ThemedToken[][];
  code: string;
}) {
  return (
    <div className="w-full">
      <section
        aria-labelledby="hero-title"
        className="border-t border-slate-200 dark:border-slate-900 overflow-hidden flex flex-col relative"
      >
        <div className="px-4 md:px-12 w-full h-full flex flex-col flex-grow relative">
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-b border-slate-200 dark:border-slate-900 relative z-20 bg-white dark:bg-slate-950" />
          <div className="relative z-20 opacity-0 pointer-events-none h-0">
            <Navigation />
          </div>

          {/* Background color layer */}
          <div className="absolute inset-y-0 left-4 md:left-12 right-4 md:right-12 bg-white dark:bg-slate-950 -z-20" />

          {/* Grid Background */}
          <div className="absolute bottom-0 top-8 md:top-12 left-4 md:left-12 right-4 md:right-12 -z-10 md:bottom-24">
            <GridBackground />
          </div>

          <div className="relative flex flex-col items-center justify-center sm:pt-16 pt-8 text-center px-6 sm:px-0">
            <div className="flex flex-col items-center w-full relative z-20">
              <Link
                href={`${siteConfig.baseLinks.blog}/series-a-announcement`}
                className="mb-6 mt-px ml-px inline-flex items-center h-[23px] w-[215px] justify-center border-0 bg-white dark:bg-slate-950 px-1 text-xs font-medium text-indigo-900 dark:text-indigo-300 shadow-none transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <span className="mr-2 flex h-2 w-2">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                </span>
                Announcing our $12M Series A
              </Link>
              <h1
                id="hero-title"
                className="inline-block py-2 text-3xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl"
                style={{ animationDuration: "700ms" }}
              >
                Simple, Elastic-Quality <br className="hidden sm:block" />{" "}
                <span className="text-highlight-blink">Search</span> for Postgres
              </h1>
            </div>

            {/* Bottom Content - In front of everything */}
            <div className="relative z-20 mt-auto flex flex-col items-center">
              <p className="text-base sm:text-lg text-gray-800 dark:text-slate-300 mb-8 mt-4">
                You want better search, not the burden of Elasticsearch.{" "}
                <br className="hidden sm:block" /> ParadeDB is the modern
                Elastic alternative built as a Postgres extension.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mb-12 sm:mb-20 sm:px-0">
                <Button className="text-md px-4 bg-indigo-600 ring-2 ring-indigo-400 dark:ring-indigo-600/50 border-1 border-indigo-400 dark:border-indigo-600 rounded-none h-10 text-white w-full sm:w-auto">
                  <Link target="_blank" href={social.CALENDLY}>
                    Book a Demo
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="text-md hover:group hover:bg-transparent bg-transparent border-0 h-10 px-4 dark:hover:bg-transparent w-full sm:w-auto"
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
        </div>

        {/* New Colorful Visual Section */}
        <div className="relative z-20 hidden md:block">
          <div className="px-4 md:px-12 w-full mx-auto relative">
            <div className="absolute top-0 left-4 md:left-12 right-4 md:right-12 h-px bg-slate-200 dark:bg-slate-900 z-30" />
            <div className="max-w-[1128px] mx-auto relative">
              <HeroVisual
                lightTokens={lightTokens}
                darkTokens={darkTokens}
                code={code}
              />
            </div>
          </div>
        </div>

        <div className="mt-0 relative z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm w-full">
          <div className="px-4 md:px-12 w-full mx-auto relative">
            <div className="absolute top-0 left-4 md:left-12 right-4 md:right-12 h-px bg-slate-200 dark:bg-slate-900 z-30" />
            <div className="absolute bottom-0 left-4 md:left-12 right-4 md:right-12 h-px bg-slate-200 dark:bg-slate-900 z-30" />
            <div className="max-w-[1128px] mx-auto">
              <LogoCloud variant="white" className="bg-transparent" />
            </div>
          </div>
        </div>

        {/* Global Vertical Lines - Rendered last to ensure they are on top */}
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        {/* Inner Vertical Borders for boxed look */}
        <div className="absolute bottom-0 top-8 md:top-12 left-1/2 -ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
        <div className="absolute bottom-0 top-8 md:top-12 left-1/2 ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
      </section>
    </div>
  );
}
