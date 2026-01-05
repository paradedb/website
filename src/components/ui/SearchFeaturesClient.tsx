"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { RiArrowRightSLine } from "@remixicon/react";
import Link from "next/link";
import { ReactNode } from "react";
import classNames from "classnames";
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
  href: string;
}

export default function SearchFeaturesClient({ features }: { features: Feature[] }) {
  return (
    <div className="px-4 md:px-12">
      <section className="py-12 md:py-20 flex flex-col items-center border-r border-l border-slate-200 dark:border-slate-900 px-6 sm:px-0">
        <Badge>Features</Badge>
          <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl">
            The <span className="text-highlight-blink">complete</span> toolkit <br className="hidden sm:block" /> for search
          </h2>
        <p className="mt-6 text-center text-base sm:text-lg text-gray-800 dark:text-slate-300 max-w-2xl">
          ParadeDB brings everything you need from a modern search engine into Postgres, including text, hybrid, and faceted search.
        </p>

        <Tabs.Root
          defaultValue={features[0].value}
          className="mt-12 w-full overflow-hidden border-t-1 border-b-1 border-slate-200 dark:border-slate-900"
        >
          {/* Header */}
          <div className="overflow-x-auto pb-px no-scrollbar bg-white dark:bg-slate-950 border-b-1 border-slate-200 dark:border-slate-900">
             <Tabs.List className="flex w-full min-w-max items-end">
               {features.map((feature, i) => (
                 <Tabs.Trigger
                   key={feature.value}
                   value={feature.value}
                   className={classNames(
                     "group relative flex-shrink-0 sm:flex-1 flex items-center justify-center gap-3 px-6 sm:px-6 py-4 sm:py-5 text-sm font-medium transition-all outline-none border-b-2 border-transparent whitespace-nowrap",
                     "data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-900 dark:data-[state=active]:text-white",
                     "text-gray-500 hover:text-indigo-700 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-900"
                   )}
                 >
                   <span className="text-xs font-mono font-semibold opacity-50 group-data-[state=active]:text-indigo-600 dark:group-data-[state=active]:text-indigo-400 group-data-[state=active]:opacity-100">
                     0{i + 1}
                   </span>
                   <span className="text-sm sm:text-base font-semibold tracking-tight">{feature.label}</span>
                 </Tabs.Trigger>
               ))}
             </Tabs.List>
          </div>

          {/* Content Area */}
          <div
            className="w-full relative bg-slate-100 dark:bg-slate-900/50"
          >
            {features.map((feature) => (
              <Tabs.Content
                key={feature.value}
                value={feature.value}
                className="outline-none"
              >
                <div className="flex flex-col lg:flex-row min-h-[360px]">
                  {/* Right Column: Code (MOVED ABOVE FOR MOBILE) */}
                  <div className="flex-1 px-2 py-6 sm:p-8 md:p-12 lg:p-16 bg-transparent flex flex-col justify-center overflow-hidden lg:order-2">
                    <div className="w-full overflow-x-auto rounded-lg bg-slate-200/20 dark:bg-slate-900/20 p-2">
                        {feature.code}
                    </div>
                  </div>

                  {/* Vertical Divider (Desktop) */}
                  <div className="hidden lg:block w-px bg-slate-200 dark:bg-slate-900 my-12 lg:order-3" />

                  {/* Horizontal Divider (Mobile) */}
                  <div className="lg:hidden h-px w-full bg-slate-200 dark:bg-slate-900 px-6 sm:px-12" />

                  {/* Left Column: Bullets */}
                  <div className="flex-1 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center lg:order-1">
                    <ul className="space-y-6 sm:space-y-8">
                        {feature.bullets.map((bullet) => (
                            <li key={bullet.title} className="flex gap-4 items-start">
                                <div className="mt-1 p-2 rounded-lg bg-indigo-100/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 shrink-0">
                                    {bullet.icon}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-semibold text-base sm:text-lg text-indigo-950 dark:text-white tracking-tight">
                                        {bullet.title}
                                    </h4>
                                    <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400 leading-relaxed">
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
      </section>
    </div>
  );
}
