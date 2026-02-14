import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import { documentation } from "@/lib/links";
import Link from "next/link";
import { Button } from "../Button";
import LogoCloud from "./LogoCloud";
import { siteConfig } from "@/app/siteConfig";
import { HeroVisual } from "./HeroVisual";
import { DarkModeOverlay } from "./DarkModeOverlay";
import Code from "@/components/Code";
import CopyToClipboard from "@/components/CopyToClipboard";

const installCommand = `curl https://www.paradedb.com | sh`;

export default async function HeroV3() {
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
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch-white border-b border-white/20 bg-indigo-700/20 opacity-60" />
        </div>

        {/* Horizontal line below top shaded region - constrained to vertical lines */}
        <div className="absolute top-[96px] md:top-[128px] left-4 md:left-12 right-4 md:right-12 h-px bg-white/20 z-30" />

        <div className="px-4 md:px-12 w-full h-full flex flex-col flex-grow relative">
          <div className="relative flex flex-col items-center justify-center sm:pt-48 pt-36 text-center px-6 sm:px-0">
            <div className="flex flex-col items-center w-full relative z-20">
              <Link
                href={`${siteConfig.baseLinks.blog}/series-a-announcement`}
                className="mb-6 mt-px ml-px inline-flex items-center h-[23px] w-[215px] justify-center border border-white/20 bg-white/10 px-1 text-xs font-medium text-white shadow-none transition-colors hover:bg-white/20 opacity-0 animate-hero-pill"
              >
                <span className="mr-2 flex h-2 w-2">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                </span>
                Announcing our $12M Series A
              </Link>
              <h1
                id="hero-title"
                className="inline-block py-2 text-3xl font-bold tracking-tighter text-white sm:text-6xl opacity-0 animate-hero-title"
              >
                Simple, Elastic-Quality <br className="hidden sm:block" />{" "}
                <span className="text-white/90">Search</span> for Postgres
              </h1>
            </div>

            {/* Bottom Content - In front of everything */}
            <div className="relative z-20 mt-auto flex flex-col items-center opacity-0 animate-hero-content">
              <p className="text-base sm:text-lg text-indigo-50 mb-8 mt-4">
                You want better search, not the burden of Elasticsearch.{" "}
                <br className="hidden sm:block" /> ParadeDB is the modern
                Elastic alternative built as a Postgres extension.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mb-6 sm:mb-8 sm:px-0">
                <Button className="text-md px-4 bg-white rounded-none h-10 text-indigo-600 hover:bg-indigo-50 w-full sm:w-auto border-0 shadow-none">
                  <Link target="_blank" href={documentation.GETTING_STARTED}>
                    Get Started
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="text-md hover:group hover:bg-white/10 bg-transparent border-none h-10 px-4 hover:bg-transparent dark:hover:bg-transparent w-full sm:w-auto"
                >
                  <Link
                    href={documentation.BASE}
                    className="text-white flex items-center gap-2"
                    target="_blank"
                  >
                    Documentation
                    <ArrowAnimated
                      className="stroke-white"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </div>
              <div className="w-full max-w-lg mb-2 sm:mb-4">
                <div className="relative bg-indigo-950/70 backdrop-blur-md border border-white/10 overflow-hidden rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <div className="absolute right-3 top-3 z-10">
                    <CopyToClipboard code={installCommand} />
                  </div>
                  <Code
                    code={installCommand}
                    lang="bash"
                    copy={false}
                    className="text-left [&_pre]:!bg-transparent [&_.shiki]:!bg-transparent [&>div>div]:!bg-transparent dark:[&_pre]:!bg-transparent dark:[&_.shiki]:!bg-transparent dark:[&>div>div]:!bg-transparent [&_code]:text-white [&_.line]:text-white [&_span]:!text-white [&_.line::before]:!hidden [&_pre]:!py-5 [&_pre]:!pl-5 [&_pre]:!pr-12"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Colorful Visual Section */}
        <div className="relative z-20">
          <HeroVisual />
        </div>

        {/* Shaded Region */}
        <div className="relative z-20 px-4 md:px-12">
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch-white border-y border-white/20 bg-indigo-700/20 opacity-60" />
        </div>

        <div className="mt-0 relative z-20 w-full">
          <div className="px-4 md:px-12 w-full mx-auto relative">
            <div className="absolute top-0 left-4 md:left-12 right-4 md:right-12 h-px bg-white/20 z-30" />
            <div className="absolute bottom-0 left-4 md:left-12 right-4 md:right-12 h-px bg-white/20 z-30" />
            <div className="w-full">
              <LogoCloud variant="white" className="bg-transparent" />
            </div>
          </div>
        </div>

        {/* Shaded Region Below Logos */}
        <div className="relative z-20 px-4 md:px-12">
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch-white border-y border-white/20 bg-indigo-700/20 opacity-60" />
        </div>

        {/* Global Vertical Lines - Rendered last to ensure they are on top */}
        <div className="absolute top-[64px] md:top-[80px] bottom-0 left-4 md:left-12 w-px bg-white/20 z-30 pointer-events-none" />
        <div className="absolute top-[64px] md:top-[80px] bottom-0 right-4 md:right-12 w-px bg-white/20 z-30 pointer-events-none" />
      </section>
    </div>
  );
}
