"use client";

import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import { documentation, social } from "@/lib/links";
import Link from "next/link";
import { Button } from "../Button";
import LogoCloud from "./LogoCloud";
import { siteConfig } from "@/app/siteConfig";
import { HeroVisual } from "./HeroVisual";

export default function HeroV3() {
  return (
    <div className="w-full">
      <section
        aria-labelledby="hero-title"
        className="overflow-hidden flex flex-col relative bg-indigo-600"
      >
        {/* Top Shaded Region */}
        <div className="absolute top-[64px] md:top-[80px] left-4 md:left-12 right-4 md:right-12 z-20">
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch-white border-b border-white/20 bg-indigo-700/20 opacity-40" />
        </div>

        {/* Horizontal line below top shaded region - constrained to vertical lines */}
        <div className="absolute top-[96px] md:top-[128px] left-4 md:left-12 right-4 md:right-12 h-px bg-white/20 z-30" />

        <div className="px-4 md:px-12 w-full h-full flex flex-col flex-grow relative">
          <div className="relative flex flex-col items-center justify-center sm:pt-48 pt-36 text-center px-6 sm:px-0">
            <div className="flex flex-col items-center w-full relative z-20">
              <Link
                href={`${siteConfig.baseLinks.blog}/series-a-announcement`}
                className="mb-6 mt-px ml-px inline-flex items-center h-[23px] w-[215px] justify-center border border-white/20 bg-white/10 px-1 text-xs font-medium text-white shadow-none transition-colors hover:bg-white/20"
              >
                <span className="mr-2 flex h-2 w-2">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                </span>
                Announcing our $12M Series A
              </Link>
              <h1
                id="hero-title"
                className="inline-block py-2 text-3xl font-bold tracking-tighter text-white sm:text-6xl"
                style={{ animationDuration: "700ms" }}
              >
                Simple, Elastic-Quality <br className="hidden sm:block" />{" "}
                <span className="text-white/90">Search</span> for Postgres
              </h1>
            </div>

            {/* Bottom Content - In front of everything */}
            <div className="relative z-20 mt-auto flex flex-col items-center">
              <p className="text-base sm:text-lg text-indigo-50 mb-8 mt-4">
                You want better search, not the burden of Elasticsearch.{" "}
                <br className="hidden sm:block" /> ParadeDB is the modern
                Elastic alternative built as a Postgres extension.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mb-8 sm:mb-12 sm:px-0">
                <Button className="text-md px-4 bg-white rounded-none h-10 text-indigo-600 hover:bg-indigo-50 w-full sm:w-auto border-0 shadow-none">
                  <Link target="_blank" href={social.CALENDLY}>
                    Book a Demo
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
            </div>
          </div>
        </div>

        {/* New Colorful Visual Section */}
        <div className="relative z-20">
          <HeroVisual />
        </div>

        {/* Shaded Region */}
        <div className="relative z-20 px-4 md:px-12">
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch-white border-y border-white/20 bg-indigo-700/20 opacity-40" />
        </div>

        <div className="mt-0 relative z-20 w-full">
          <div className="px-4 md:px-12 w-full mx-auto relative">
            <div className="absolute top-0 left-4 md:left-12 right-4 md:right-12 h-px bg-white/20 z-30" />
            <div className="absolute bottom-0 left-4 md:left-12 right-4 md:right-12 h-px bg-white/20 z-30" />
            <div className="max-w-[1128px] mx-auto">
              <LogoCloud variant="white" className="bg-transparent" />
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
