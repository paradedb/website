import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import { documentation } from "@/lib/links";
import { siteConfig } from "@/app/siteConfig";
import Link from "next/link";
import { Button } from "../Button";
import LogoCloud from "./LogoCloud";
import { DarkModeOverlay } from "./DarkModeOverlay";
import { HeroVisual } from "./HeroVisual";
import CopyableCommand from "@/components/CopyableCommand";

const installCommand = `curl -fsSL https://paradedb.com/install.sh | sh`;

export default async function Hero() {
  return (
    <div className="w-full bg-indigo-600 relative opacity-0 animate-hero-wrapper">
      {/* Alpha overlay for dark mode */}
      <DarkModeOverlay />

      <section
        aria-labelledby="hero-title"
        className="overflow-hidden flex flex-col relative max-w-[1440px] mx-auto"
      >
        {/* Top Shaded Region */}
        <div className="absolute top-[64px] md:top-[80px] left-4 md:left-12 right-4 md:right-12 z-20">
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch-white bg-indigo-700/20 opacity-60" />
        </div>

        {/* Horizontal line below top shaded region - constrained to vertical lines */}
        <div className="absolute top-[96px] md:top-[128px] left-4 md:left-12 right-4 md:right-12 h-px bg-white/20 z-30" />

        <div className="px-4 md:px-12 w-full h-full flex flex-col flex-grow relative">
          <div className="relative flex flex-col items-start justify-center sm:pt-56 pt-40 text-left px-6 sm:px-16 lg:px-24">
            <div className="flex flex-col items-start w-full max-w-4xl relative z-40">
              <Link
                href={siteConfig.baseLinks.cloud}
                className="group inline-flex items-center gap-2 rounded-none border border-white/30 bg-white/10 px-3 py-1 mb-6 text-xs sm:text-sm font-medium text-indigo-100 transition-colors hover:border-white/60 hover:text-white opacity-0 animate-hero-title"
              >
                <span className="size-1.5 rounded-full bg-white" />
                ParadeDB Cloud is coming
              </Link>
              <h1
                id="hero-title"
                className="relative inline-block text-2xl sm:text-5xl font-bold tracking-tighter leading-[1.15] text-white opacity-0 animate-hero-title"
              >
                <span
                  aria-hidden="true"
                  className="hidden sm:block absolute -left-16 lg:-left-24 translate-x-[calc(-50%+0.5px)] top-[0.15em] h-[0.9em] w-[3px] bg-white z-40"
                />
                Make slow search queries fly in Postgres.
              </h1>
            </div>

            {/* Bottom Content - In front of everything */}
            <div className="relative z-20 mt-auto flex flex-col items-start w-full max-w-4xl opacity-0 animate-hero-content">
              <p className="text-lg sm:text-xl font-normal leading-[1.4] text-indigo-100 mt-6 mb-8">
              One Postgres platform for your hardest search queries. Text and vector search, filters, facets, and joins where your OLTP database falls short.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm sm:max-w-none sm:w-auto justify-start mb-6 sm:mb-8 sm:px-0">
                <Button
                  asChild
                  className="text-md px-4 bg-white rounded-none h-10 text-indigo-600 hover:bg-indigo-50 w-full sm:w-auto border-0 shadow-none"
                >
                  <Link href={documentation.GETTING_STARTED} target="_blank">
                    Get Started
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="text-md hover:group bg-transparent border-none h-10 px-4 hover:bg-transparent dark:hover:bg-transparent w-full sm:w-auto"
                >
                  <Link
                    href={siteConfig.baseLinks.cloud}
                    className="text-white flex items-center justify-center gap-2 w-full"
                  >
                    Cloud Early Access
                    <ArrowAnimated
                      className="stroke-white"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </div>
              <div className="hidden sm:flex items-center gap-2 mt-3 mb-2 sm:mb-4 font-mono text-sm text-white">
                <span>Or run locally with</span>
                <CopyableCommand code={installCommand} />
              </div>
            </div>

          </div>
        </div>

        {/* Dithered wave */}
        <div className="relative z-10 -mt-2 md:-mt-3">
          <HeroVisual />
        </div>

        <div className="mt-0 relative z-20 w-full">
          <div className="px-4 md:px-12 w-full mx-auto relative">
            <div className="absolute top-0 left-4 md:left-12 right-4 md:right-12 h-px bg-white/20 z-30" />
            <div className="w-full px-6 sm:px-16 lg:px-24">
              <LogoCloud
                variant="white"
                className="bg-transparent px-0 sm:px-0 md:px-0"
              />
            </div>
          </div>
        </div>

        {/* Global Vertical Lines - Rendered last to ensure they are on top */}
        <div className="absolute top-[64px] md:top-[80px] bottom-0 left-4 md:left-12 w-px bg-white/20 z-30 pointer-events-none" />
        <div className="absolute top-[64px] md:top-[80px] bottom-0 right-4 md:right-12 w-px bg-white/20 z-30 pointer-events-none" />
      </section>
    </div>
  );
}
