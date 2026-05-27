"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { ReactNode } from "react";
import { cx } from "@/lib/utils";
import { Badge } from "./Badge";

interface Feature {
  value: string;
  label: string;
  bullets: {
    title: string;
    description: string;
    icon: ReactNode;
  }[];
  code: ReactNode;
}

export default function SearchFeaturesClient({
  features,
}: {
  features: Feature[];
}) {
  return (
    <div className="w-full relative bg-[#ebe9e5] dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative w-full">
        <section className="flex flex-col items-center border-r border-l border-[#d7d4cf] dark:border-slate-900 px-0 pb-12 md:pb-20">
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch bg-diagonal-hatch-warm border-b border-[#d7d4cf] dark:border-slate-900 relative z-20 bg-[#e4e1dc] dark:bg-slate-900/50 opacity-60" />
          <div className="flex w-full flex-col items-center pt-12 md:pt-20">
            <Badge className="mb-6">Features</Badge>
            <h2 className="homepage-section-title px-6 text-center text-3xl sm:px-0 sm:text-6xl">
              Stop <span className="text-highlight-blink">chasing</span> the{" "}
              <br className="hidden sm:block" /> next slow query
            </h2>
            <p className="mt-6 text-center text-base sm:text-lg text-[#77736d] dark:text-slate-300 max-w-2xl px-6 sm:px-0">
              You don&apos;t need dozens of tuned indexes to make queries fast.
              ParadeDB uses a single, table-covering index to accelerate the
              most demanding queries.
            </p>

            <Tabs.Root
              defaultValue={features[0].value}
              className="mt-12 w-full overflow-hidden border-t-1 border-b-1 border-[#d7d4cf] dark:border-slate-900"
            >
              {/* Header */}
              <div className="overflow-x-auto pb-px no-scrollbar bg-[#ebe9e5] dark:bg-slate-950 border-b-1 border-[#d7d4cf] dark:border-slate-900">
                <Tabs.List className="flex w-full min-w-max items-end">
                  {features.map((feature, i) => (
                    <Tabs.Trigger
                      key={feature.value}
                      value={feature.value}
                      className={cx(
                        "group relative flex-shrink-0 sm:flex-1 flex items-center justify-center gap-3 px-6 sm:px-6 py-4 sm:py-5 text-sm font-medium transition-all outline-none border-b-2 border-transparent whitespace-nowrap",
                        "data-[state=active]:border-indigo-600 data-[state=active]:text-[#1d1d1b] dark:data-[state=active]:text-white",
                        "text-[#77736d] hover:text-indigo-700 dark:hover:text-slate-200 hover:bg-[#e4e1dc] dark:hover:bg-slate-900",
                      )}
                    >
                      <span className="text-xs font-mono font-semibold opacity-50 group-data-[state=active]:text-indigo-600 dark:group-data-[state=active]:text-indigo-400 group-data-[state=active]:opacity-100">
                        0{i + 1}
                      </span>
                      <span className="text-sm sm:text-base font-semibold tracking-tight">
                        {feature.label}
                      </span>
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
              </div>

              {/* Content Area */}
              <div className="w-full relative bg-[#e4e1dc] dark:bg-slate-900/50">
                {features.map((feature) => (
                  <Tabs.Content
                    key={feature.value}
                    value={feature.value}
                    className="outline-none"
                  >
                    <div className="flex flex-col lg:flex-row min-h-[360px]">
                      {/* Right Column: Code (MOVED ABOVE FOR MOBILE) */}
                      <div className="flex-1 px-2 py-6 sm:p-8 md:p-12 lg:p-16 bg-transparent flex flex-col justify-center overflow-hidden lg:order-2">
                        <div className="w-full overflow-x-auto rounded-lg bg-[#d7d4cf]/30 dark:bg-slate-900/20 p-2">
                          {feature.code}
                        </div>
                      </div>

                      {/* Vertical Divider (Desktop) */}
                      <div className="hidden lg:block w-px bg-[#d7d4cf] dark:bg-slate-900 my-12 lg:order-3" />

                      {/* Horizontal Divider (Mobile) */}
                      <div className="lg:hidden h-px w-full bg-[#d7d4cf] dark:bg-slate-900 px-6 sm:px-12" />

                      {/* Left Column: Bullets */}
                      <div className="flex-1 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center lg:order-1">
                        <ul className="space-y-6 sm:space-y-8">
                          {feature.bullets.map((bullet) => (
                            <li
                              key={bullet.title}
                              className="flex gap-4 items-start"
                            >
                              <div className="mt-1 shrink-0 rounded-lg border border-[#d7d4cf] bg-[#ebe9e5] p-2 text-indigo-600 dark:border-slate-800 dark:bg-indigo-950/20 dark:text-indigo-400">
                                {bullet.icon}
                              </div>
                              <div className="flex flex-col gap-1">
                                <h4 className="font-semibold text-base sm:text-lg text-[#1d1d1b] dark:text-white tracking-tight">
                                  {bullet.title}
                                </h4>
                                <p className="text-sm sm:text-base text-[#77736d] dark:text-slate-400 leading-relaxed">
                                  {bullet.description}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Tabs.Content>
                ))}
              </div>
            </Tabs.Root>
          </div>
        </section>
      </div>
    </div>
  );
}
