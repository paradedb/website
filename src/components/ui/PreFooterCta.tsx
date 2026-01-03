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
        <div className="absolute inset-y-0 left-2 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-2 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        {/* Inner Vertical Borders for boxed look */}
        <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200/50 dark:bg-slate-900/50 z-30 pointer-events-none hidden xl:block" />
        <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200/50 dark:bg-slate-900/50 z-30 pointer-events-none hidden xl:block" />

        {/* Bottom Section Border constrained to vertical borders */}
        <div className="absolute bottom-0 left-2 md:left-12 right-2 md:right-12 h-px bg-white dark:bg-slate-950 z-30 pointer-events-none" />

        <div className="px-2 md:px-12 w-full flex flex-col relative">
          {/* Background color layer */}
          <div className="absolute inset-0 bg-white dark:bg-slate-950 -z-20" />

          {/* Bottom fade to white/black */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 via-white/60 dark:via-slate-950/60 to-transparent z-0 pointer-events-none" />
          {/* Side fades to white/black */}
          <div className="absolute top-0 bottom-0 left-0 w-24 md:w-60 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-0 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 md:w-60 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-0 pointer-events-none" />

          <div className="relative flex flex-col items-center justify-center px-4 pt-24 md:pt-40 pb-12 md:pb-20 text-center">
            <div className="relative z-20 flex flex-col items-center">
              <h1 className="text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl leading-[1.1]">
                Elastic-quality search<br /><span className="text-highlight-blink">without the complexity</span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-12">
                <Button
                  asChild
                  className="text-md px-4 bg-indigo-600 ring-2 ring-indigo-400 dark:ring-indigo-600/50 border-1 border-indigo-400 dark:border-indigo-600 rounded-none h-10 text-white font-semibold shadow-none"
                >
                  <Link href={email.SALES}>Book a Demo</Link>
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
        </div>
      </section>
    </div>
  );
}
