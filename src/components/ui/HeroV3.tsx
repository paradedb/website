"use client";

import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import { documentation, social } from "@/lib/links";
import Link from "next/link";
import { Button } from "../Button";
import LogoCloud from "./LogoCloud";
import { Navigation } from "@/components/ui/Navbar";
import { siteConfig } from "@/app/siteConfig";
import { GridBackground } from "@/components/ui/GridBackground";

export default function HeroV3() {
  return (
    <div className="w-full pt-4">
      <section
        aria-labelledby="hero-title"
        className="border-y border-slate-200 overflow-hidden flex flex-col relative"
      >
        <div className="absolute inset-y-0 left-2 md:left-12 w-px bg-slate-200 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-2 md:right-12 w-px bg-slate-200 z-30 pointer-events-none" />

        <div className="px-2 md:px-12 w-full h-full flex flex-col flex-grow relative">
          <div className="relative z-20 opacity-0 pointer-events-none h-0">
            <Navigation />
          </div>

          {/* Grid Background */}
          <GridBackground />

          {/* Bottom fade to white */}
          <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-white via-white/60 to-transparent z-0 pointer-events-none" />
          {/* Side fades to white */}
          <div className="absolute top-0 bottom-0 left-0 w-24 md:w-60 bg-gradient-to-r from-white to-transparent z-0 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 md:w-60 bg-gradient-to-l from-white to-transparent z-0 pointer-events-none" />

          <div
            className="relative flex flex-col items-center justify-center px-4 sm:py-24 py-12 text-center bg-slate-100/50"
          >
            <div className="flex flex-col items-center w-full relative z-20">
              <Link
                href={`${siteConfig.baseLinks.blog}/series-a-announcement`}
                className="mb-6 mt-px ml-px inline-flex items-center h-[23px] w-[215px] justify-center border-0 bg-white px-1 text-xs font-medium text-indigo-900 shadow-none transition-colors hover:bg-slate-50"
              >
                <span className="mr-2 flex h-2 w-2">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                </span>
                Announcing our $12M Series A
              </Link>
              <h1
                id="hero-title"
                className="inline-block py-2 text-4xl font-bold tracking-tighter text-indigo-950 sm:text-6xl"
                style={{ animationDuration: "700ms" }}
              >
                Simple, Elastic-Quality<br/><span className="text-highlight-blink">Search</span> for Postgres
              </h1>
            </div>

            {/* Bottom Content - In front of everything */}
            <div className="relative z-20 mt-auto flex flex-col items-center">
              <p className="text-lg text-gray-800 mb-8 mt-4">
                You want better search, not the burden of Elasticsearch.<br/>ParadeDB is
                the modern Elastic alternative built as a Postgres extension.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                <Button className="text-md px-4 bg-indigo-600 ring-2 ring-indigo-400 border-1 border-indigo-400 rounded-none h-10 text-white">
                  <Link target="_blank" href={social.CALENDLY}>
                    Book a Demo
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="light"
                  className="text-md hover:group hover:bg-transparent bg-transparent border-0 h-10 px-4"
                >
                  <Link
                    href={documentation.BASE}
                    className="text-indigo-900 flex items-center gap-2"
                    target="_blank"
                  >
                    Documentation
                    <ArrowAnimated
                      className="stroke-indigo-900"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-0 relative z-20 bg-white/80 backdrop-blur-sm w-full border-t border-slate-200">
          <div className="px-2 md:px-12 w-full mx-auto">
            <LogoCloud variant="white" className="border-t-0 bg-transparent" />
          </div>
        </div>
      </section>
    </div>
  );
}
