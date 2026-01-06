"use client";

import { Logos } from "./Logos";
import Link from "next/link";
import { RiArrowRightLine } from "@remixicon/react";
import { Badge } from "./Badge";

const CaseStudyCard = ({
  logo,
  quote,
  author,
  role,
  initials,
  href,
  companyName,
}: {
  logo: React.ReactNode;
  quote: string;
  author: string;
  role: string;
  initials: string;
  href: string;
  companyName: string;
}) => (
  <Link
    href={href}
    className="group relative flex flex-col items-start p-8 md:p-12 text-left overflow-hidden h-full"
  >
    {/* Content Wrapper - Blurs on hover */}
    <div className="w-full flex flex-col items-start transition-all duration-300 group-hover:blur-sm group-hover:opacity-40">
      <div className="mb-8 h-8 sm:h-10 flex items-center">{logo}</div>
      <blockquote className="text-sm md:text-lg text-slate-800 dark:text-slate-300 leading-relaxed mb-8">
        {quote}
      </blockquote>
      <div className="mt-auto flex items-center gap-3">
        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-wide border border-slate-200 dark:border-slate-700">
          {initials}
        </div>
        <div className="text-left">
          <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            {author}
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-sm">
            {role}
          </div>
        </div>
      </div>
    </div>

    {/* Hover Overlay */}
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
      <div className="flex items-center gap-2 text-indigo-950 dark:text-white font-semibold bg-transparent px-6 py-3">
        Read {companyName} case study
        <RiArrowRightLine className="size-4" />
      </div>
    </div>
  </Link>
);

export default function SocialProof() {
  return (
    <div className="w-full relative opacity-0 animate-fade-in delay-1600 bg-white dark:bg-slate-950">
      <section className="overflow-hidden flex flex-col relative max-w-[1440px] mx-auto">
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        {/* Section Borders constrained to vertical borders */}
        <div className="absolute top-0 left-4 md:left-12 right-4 md:right-12 h-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute bottom-0 left-4 md:left-12 right-4 md:right-12 h-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        {/* Additional Vertical Lines */}
        <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
        <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />

        <div className="px-4 md:px-12 w-full flex flex-col relative">
          {/* Background color layer */}
          <div className="absolute inset-y-0 left-4 md:left-12 right-4 md:right-12 bg-slate-100 dark:bg-slate-950/50 -z-10" />

          {/* Inner Vertical Borders for boxed look */}
          <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
          <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />

          {/* Section 1: Case Studies (Gray Background) */}
          <div className="relative flex flex-col items-center justify-center sm:py-24 py-12 text-center bg-transparent">
            {/* Fades for Case Studies Section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent z-0 pointer-events-none" />

            <div className="flex flex-col items-center w-full relative z-20 px-6 sm:px-0">
              <Badge className="mb-6 mt-px ml-px">Case Studies</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl mb-4">
                <span className="text-highlight-blink">Trusted</span> by
                enterprises
              </h2>
              <p className="text-base sm:text-lg text-gray-800 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12 px-2">
                The most innovative companies are simplifying their search stack
                with ParadeDB.
              </p>
            </div>

            <div className="relative w-full z-20">
              <div className="max-w-[1128px] mx-auto grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-900">
                <div className="border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-900">
                  <CaseStudyCard
                    href="#"
                    logo={
                      <Logos.BiltRewards className="h-4 w-auto dark:brightness-0 dark:invert opacity-80" />
                    }
                    quote="“Using ParadeDB has unlocked the ability to rapidly launch new search capabilities across our products — something that previously would have taken weeks of effort.”"
                    initials="JK"
                    author="John King"
                    role="Backend Engineer, Bilt"
                    companyName="Bilt"
                  />
                </div>

                <div>
                  <CaseStudyCard
                    href="#"
                    logo={
                      <Logos.Alibaba className="h-8 w-auto dark:brightness-0 dark:invert opacity-80" />
                    }
                    quote="“ParadeDB has excellent performance and throughput in search, helping our clients achieve structured analysis and full-text retrieval using a pure Postgres engine.”"
                    initials="PB"
                    author="Pang Bo"
                    role="Product Manager, Alibaba"
                    companyName="Alibaba"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
