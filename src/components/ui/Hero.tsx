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
                className="group inline-flex items-center mb-6 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-indigo-200 transition-colors hover:text-white opacity-0 animate-hero-title"
              >
                <span className="relative mr-3.5 flex size-2 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-white opacity-75 motion-reduce:hidden" />
                  <span className="relative size-2 rounded-full bg-white" />
                </span>
                ParadeDB Cloud is coming
                <ArrowAnimated
                  className="stroke-indigo-200 group-hover:stroke-white scale-75 group-hover:scale-100 origin-left transition-transform ml-2"
                  aria-hidden="true"
                />
              </Link>
              <h1
                id="hero-title"
                className="relative inline-block text-2xl sm:text-5xl font-bold tracking-tighter leading-[1.15] text-white opacity-0 animate-hero-title"
              >
                <span
                  aria-hidden="true"
                  className="hidden sm:block absolute -left-16 lg:-left-24 translate-x-[calc(-50%+0.5px)] top-[0.15em] h-[0.9em] w-[3px] bg-white z-40"
                />
                Just use Postgres.
              </h1>
            </div>

            {/* Bottom Content - In front of everything */}
            <div className="relative z-20 mt-auto flex flex-col items-start w-full max-w-4xl opacity-0 animate-hero-content">
              <p className="text-lg sm:text-xl font-normal leading-[1.4] text-indigo-100 mt-6 mb-8">
                Modern applications need more than transactions — they need text
                and vector search, filters, joins, and facets. ParadeDB makes it
                all fast in one Postgres platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm sm:max-w-none sm:w-auto justify-start mb-6 sm:mb-8 sm:px-0">
                <Button
                  asChild
                  className="text-md px-4 bg-white rounded-none h-10 text-indigo-600 hover:bg-indigo-50 w-full sm:w-auto border-0 shadow-none"
                >
                  <Link href={documentation.GETTING_STARTED} target="_blank">
                    Read Docs
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
        <div className="relative z-10 mt-6 md:mt-10">
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
