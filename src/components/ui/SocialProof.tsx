"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RiArrowDownLine,
  RiArrowRightLine,
  RiArrowUpLine,
} from "@remixicon/react";
import { cx } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { CardWave } from "./CardWave";

const STUDIES = [
  {
    key: "bilt",
    name: "Bilt Rewards",
    href: "/customers/case-study-bilt",
    logo: {
      src: "/brand/customers/bilt-rewards.svg",
      width: 179,
      height: 30,
      className: "h-4 w-auto",
    },
    tabLogoClassName: "h-3",
    quote:
      "“Using ParadeDB has unlocked the ability to rapidly launch new search capabilities across our products — something that previously would have taken weeks of effort.”",
    initials: "JK",
    author: "John King",
    role: "Backend Engineer, Bilt",
    stat: "95%",
    direction: "down" as const,
    impact:
      "Reduction in query timeouts across Bilt's resident search, with P95 query latency down 50%.",
    panelBg: "bg-slate-900 dark:bg-slate-800",
    accentBg: "bg-slate-900 dark:bg-slate-700",
  },
  {
    key: "alibaba",
    name: "Alibaba",
    href: "/customers/case-study-alibaba",
    logo: {
      src: "/brand/customers/alibaba.svg",
      width: 127,
      height: 30,
      className: "h-8 w-auto",
    },
    tabLogoClassName: "h-5",
    quote:
      "“ParadeDB has excellent performance and throughput in search, helping our clients achieve structured analysis and full-text retrieval using a pure Postgres engine.”",
    initials: "PB",
    author: "Pang Bo",
    role: "Product Manager, Alibaba",
    stat: "5x",
    direction: "down" as const,
    impact:
      "Lower query latency than Lucene at high concurrency in AnalyticDB benchmarks.",
    panelBg: "bg-[#FF6600]",
    accentBg: "bg-[#FF6600]",
    waveColor: "#ffffff4d",
  },
  {
    key: "modern-treasury",
    name: "Modern Treasury",
    href: "/customers/case-study-modern-treasury",
    logo: {
      src: "/brand/customers/modern-treasury.svg",
      width: 344,
      height: 30,
      className: "h-4 w-auto",
    },
    tabLogoClassName: "h-3",
    quote:
      "“Built on the solid foundation of Postgres, ParadeDB provides the good parts of Elasticsearch we actually need, without the infrastructure and hassle of data synchronization.”",
    initials: "MH",
    author: "Matt Higgins",
    role: "Head of Engineering, Modern Treasury",
    stat: "3x",
    direction: "up" as const,
    impact:
      "Faster writes after replacing up to 26 B-tree and GIN indexes over one table with a single ParadeDB index.",
    panelBg: "bg-[#00835A]",
    accentBg: "bg-[#00835A] dark:bg-[#00B37A]",
  },
];

export default function SocialProof() {
  const [active, setActive] = useState(0);
  const study = STUDIES[active];

  return (
    <div className="w-full relative bg-white dark:bg-slate-950">
      <section className="overflow-hidden flex flex-col relative max-w-[1440px] mx-auto">
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        <div className="px-4 md:px-12 w-full flex flex-col relative">
          <div className="relative flex flex-col items-center justify-center sm:py-16 py-10 bg-transparent">
            <div className="mx-auto w-full max-w-[1128px] px-4 sm:px-12 xl:px-0 relative">
              <SectionHeader
                eyebrow="Case Studies"
                title="Trusted by enterprises."
                description="The most innovative companies use ParadeDB to do more with Postgres."
                className="mb-12"
              />
            </div>

            <div className="relative w-full z-20">
              <div className="relative">
                <div className="max-w-[1128px] mx-auto">
                  <div className="max-w-full overflow-x-auto no-scrollbar">
                    <div
                      role="tablist"
                      aria-label="Case studies"
                      className="inline-flex border border-b-0 border-slate-200 dark:border-slate-900 divide-x divide-slate-200 dark:divide-slate-900 bg-white dark:bg-slate-900/50"
                    >
                      {STUDIES.map((s, i) => (
                        <button
                          key={s.key}
                          role="tab"
                          aria-selected={i === active}
                          aria-label={s.name}
                          onClick={() => setActive(i)}
                          className={cx(
                            "group cursor-pointer flex items-center justify-center px-5 py-2.5 transition-colors",
                            i === active
                              ? s.accentBg
                              : "hover:bg-slate-50 dark:hover:bg-slate-900",
                          )}
                        >
                          <Image
                            src={s.logo.src}
                            alt=""
                            width={s.logo.width}
                            height={s.logo.height}
                            className={cx(
                              s.tabLogoClassName,
                              "w-auto transition-opacity",
                              i === active
                                ? "brightness-0 invert"
                                : "brightness-0 opacity-40 group-hover:opacity-60 dark:invert",
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    key={study.key}
                    className={cx(
                      "animate-[slide-up-fade_500ms_cubic-bezier(0.16,1,0.3,1)] grid md:grid-cols-[360px_1fr] text-left border border-slate-200 dark:border-slate-900",
                      study.panelBg,
                    )}
                  >
                    <aside className="relative flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/15 p-8 md:p-12 pb-20 md:pb-28 text-white">
                      <CardWave color={study.waveColor ?? "#ffffff2e"} />
                      <p className="font-mono text-xs uppercase tracking-widest text-white/60 mb-4">
                        Impact
                      </p>
                      <div className="mb-4 flex items-end gap-1.5 text-5xl md:text-6xl font-semibold tracking-tight">
                        {study.stat}
                        {study.direction === "up" ? (
                          <RiArrowUpLine
                            aria-hidden="true"
                            className="size-5 md:size-7 shrink-0 mb-1 md:mb-1.5"
                          />
                        ) : (
                          <RiArrowDownLine
                            aria-hidden="true"
                            className="size-5 md:size-7 shrink-0 mb-1 md:mb-1.5"
                          />
                        )}
                      </div>
                      <p className="text-sm md:text-base leading-relaxed text-white/90">
                        {study.impact}
                      </p>
                      <Link
                        href={study.href}
                        className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white"
                      >
                        Read the case study
                        <RiArrowRightLine className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </aside>

                    <div className="relative flex flex-col items-start p-8 md:p-12 pb-20 md:pb-28">
                      <CardWave color={study.waveColor ?? "#ffffff2e"} />
                      <div className="mb-8 flex h-8 items-center">
                        <Image
                          src={study.logo.src}
                          alt={study.name}
                          width={study.logo.width}
                          height={study.logo.height}
                          className={cx(
                            study.logo.className,
                            "brightness-0 invert opacity-90",
                          )}
                        />
                      </div>
                      <blockquote className="text-base md:text-lg text-white/90 leading-relaxed mb-8">
                        {study.quote}
                      </blockquote>
                      <div className="mt-auto flex items-center gap-3">
                        <div className="size-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 font-bold text-xs uppercase tracking-wide border border-white/20">
                          {study.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">
                            {study.author}
                          </div>
                          <div className="text-white/60 text-sm">
                            {study.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <Link
                  href="/customers"
                  className="group inline-flex items-center gap-2 text-indigo-950 dark:text-white font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  Read other case studies
                  <RiArrowRightLine className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
