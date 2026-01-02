"use client";

import { email, documentation } from "@/lib/links";
import Link from "next/link";
import { Button } from "../Button";
import { ArrowAnimated } from "@/components/ui/ArrowAnimated";

export default function PreFooterCta() {
  return (
    <div className="w-full">
      <section className="overflow-hidden flex flex-col relative">
        {/* Vertical Layout Borders */}
        <div className="absolute inset-y-0 left-2 md:left-12 w-px bg-slate-200 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-2 md:right-12 w-px bg-slate-200 z-30 pointer-events-none" />

        {/* Inner Vertical Borders for boxed look */}
        <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200/50 z-30 pointer-events-none hidden xl:block" />
        <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200/50 z-30 pointer-events-none hidden xl:block" />

        {/* Bottom Section Border constrained to vertical borders */}
        <div className="absolute bottom-0 left-2 md:left-12 right-2 md:right-12 h-px bg-white z-30 pointer-events-none" />

        <div className="px-2 md:px-12 w-full flex flex-col relative">
          {/* Grid Background */}
          {/* <GridBackground className="opacity-50"/> */}

          {/* Bottom fade to white */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/60 to-transparent z-0 pointer-events-none" />
          {/* Side fades to white */}
          <div className="absolute top-0 bottom-0 left-0 w-24 md:w-60 bg-gradient-to-r from-white to-transparent z-0 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 md:w-60 bg-gradient-to-l from-white to-transparent z-0 pointer-events-none" />

          <div className="relative flex flex-col items-center justify-center px-4 pt-24 md:pt-40 pb-12 md:pb-20 text-center">
            <div className="relative z-20 flex flex-col items-center">
              <h1 className="text-4xl font-bold tracking-tighter text-indigo-950 sm:text-6xl leading-[1.1]">
                Ship faster search<br /><span className="text-highlight-blink">without the complexity</span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-12">
                <Button
                  asChild
                  className="text-md px-4 bg-indigo-600 ring-2 ring-indigo-400 border-1 border-indigo-400 rounded-none h-10 text-white font-semibold shadow-none"
                >
                  <Link href={email.SALES}>Book a Demo</Link>
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
      </section>
    </div>
  );
}
