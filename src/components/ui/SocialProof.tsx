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
      <div className="mb-8 h-10 flex items-center">{logo}</div>
      <blockquote className="text-md text-slate-800 leading-relaxed mb-8">
        {quote}
      </blockquote>
      <div className="mt-auto flex items-center gap-3">
        <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase tracking-wide border border-slate-200">
          {initials}
        </div>
        <div className="text-left">
          <div className="font-semibold text-slate-900 text-sm">{author}</div>
          <div className="text-slate-500 text-sm">{role}</div>
        </div>
      </div>
    </div>

    {/* Hover Overlay */}
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
      <div className="flex items-center gap-2 text-indigo-950 font-semibold bg-transparent px-6 py-3">
        Read {companyName} case study
        <RiArrowRightLine className="size-4" />
      </div>
    </div>
  </Link>
);

export default function SocialProof() {
  return (
    <div className="w-full">
      <section className="overflow-hidden flex flex-col relative">
        <div className="absolute inset-y-0 left-2 md:left-12 w-px bg-slate-200 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-2 md:right-12 w-px bg-slate-200 z-30 pointer-events-none" />

        {/* Section Borders constrained to vertical borders */}
        <div className="absolute top-0 left-2 md:left-12 right-2 md:right-12 h-px bg-slate-200 z-30 pointer-events-none" />
        <div className="absolute bottom-0 left-2 md:left-12 right-2 md:right-12 h-px bg-slate-200 z-30 pointer-events-none" />

        {/* Additional Vertical Lines */}
        <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200/50 z-30 pointer-events-none hidden xl:block" />
        <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200/50 z-30 pointer-events-none hidden xl:block" />

        <div className="px-2 md:px-12 w-full flex flex-col relative">
          {/* Section 1: Case Studies (Gray Background) */}
          <div className="relative flex flex-col items-center justify-center px-4 sm:py-24 py-12 text-center bg-slate-100/50">
            {/* Fades for Case Studies Section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-0 pointer-events-none" />

            <div className="flex flex-col items-center w-full relative z-20">
              <Badge className="mb-6 mt-px ml-px bg-white border-slate-200">
                Case Studies
              </Badge>
              <h2 className="text-4xl font-bold tracking-tighter text-indigo-950 sm:text-6xl mb-4">
                <span className="text-highlight-blink">Trusted</span> by
                enterprises
              </h2>
              <p className="text-lg text-gray-800 max-w-2xl mx-auto leading-relaxed mb-12">
                The most innovative companies are simplifying their search stack with ParadeDB.
              </p>
            </div>

            <div className="relative w-full max-w-[1128px] mx-auto z-20">
              {/* Horizontal Lines */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100vw-16px)] md:w-[calc(100vw-96px)] h-px bg-slate-200 hidden md:block z-30 pointer-events-none" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100vw-16px)] md:w-[calc(100vw-96px)] h-px bg-slate-200 hidden md:block z-30 pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-2 bg-white border-y md:border-y border-slate-200">
                <div className="border-b md:border-b-0 md:border-r border-slate-200">
                  <CaseStudyCard
                    href="#"
                    logo={<Logos.BiltRewards className="h-4 w-auto" />}
                    quote="“ParadeDB allowed us to consolidate our stack. We replaced Elasticsearch with Postgres and saw 10x query performance improvement while reducing costs by 60%.”"
                    initials="AC"
                    author="Alex Cohen"
                    role="VP of Engineering, Bilt"
                    companyName="Bilt"
                  />
                </div>

                <div>
                  <CaseStudyCard
                    href="#"
                    logo={<Logos.Alibaba className="h-8 w-auto" />}
                    quote="“We needed a search engine that could handle petabytes of data with sub-second latency. ParadeDB delivered exactly that, directly within our existing Postgres infrastructure.”"
                    initials="JL"
                    author="Jun Liu"
                    role="Principal Architect, Alibaba"
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
