"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { RiArrowRightSLine } from "@remixicon/react";
import Link from "next/link";
import { Badge } from "../Badge";
import { ReactNode } from "react";
import classNames from "classnames";

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
    <div className="px-2 md:px-12">
      <section className="mt-12 md:mt-24 flex flex-col items-center">
        <Badge>Features</Badge>
        <h2 className="mt-4 text-center text-4xl font-bold tracking-tighter text-indigo-950 sm:text-6xl">
          The full toolkit for <span className="text-indigo-600">search</span>
        </h2>
        <p className="mt-6 text-center text-lg text-gray-600 max-w-2xl">
          Out of the box, ParadeDB comes with everything you need to build a modern search application.
        </p>

        <Tabs.Root
          defaultValue={features[0].value}
          className="mt-12 w-full overflow-hidden ring-1 ring-indigo-200/80"
        >
          {/* Header */}
          <div className="overflow-x-auto pb-px no-scrollbar bg-white border-b border-gray-100">
             <Tabs.List className="flex w-full min-w-max items-end">
               {features.map((feature, i) => (
                 <Tabs.Trigger
                   key={feature.value}
                   value={feature.value}
                   className={classNames(
                     "group relative flex-1 flex items-center justify-center gap-3 px-6 py-5 text-sm font-medium transition-all outline-none border-b-2 border-transparent",
                     "data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-900",
                     "text-gray-500 hover:text-indigo-700 hover:bg-gray-50"
                   )}
                 >
                   <span className="text-xs font-mono font-semibold opacity-50 group-data-[state=active]:text-indigo-600 group-data-[state=active]:opacity-100">
                     0{i + 1}
                   </span>
                   <span className="text-base font-semibold tracking-tight">{feature.label}</span>
                 </Tabs.Trigger>
               ))}
             </Tabs.List>
          </div>

          {/* Content Area */}
          <div
            className="w-full relative bg-indigo-50/50"
          >
            {features.map((feature) => (
              <Tabs.Content
                key={feature.value}
                value={feature.value}
                className="outline-none"
              >
                <div className="flex flex-col lg:flex-row min-h-[360px]">
                  {/* Left Column: Bullets */}
                  <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <ul className="space-y-8">
                        {feature.bullets.map((bullet) => (
                            <li key={bullet.title} className="flex gap-4 items-start">
                                <div className="mt-1 p-2 rounded-lg bg-indigo-100/50 text-indigo-600 shrink-0">
                                    {bullet.icon}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-semibold text-lg text-indigo-950 tracking-tight">
                                        {bullet.title}
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed text-base">
                                        {bullet.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-10 ml-2">
                       <Link
                         href={feature.href}
                         className="text-sm group inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                       >
                         Learn more
                         <RiArrowRightSLine className="size-5 transition-transform group-hover:translate-x-1" />
                       </Link>
                    </div>
                  </div>

                  {/* Vertical Divider (Desktop) */}
                  <div className="hidden lg:block w-px bg-indigo-200/80 my-12" />

                  {/* Horizontal Divider (Mobile) */}
                  <div className="lg:hidden h-px w-full bg-indigo-100/50 mx-8 md:mx-12" />

                  {/* Right Column: Code */}
                  <div className="flex-1 p-8 md:p-12 lg:p-16 bg-transparent flex flex-col justify-center overflow-hidden">
                    <div className="w-full overflow-x-auto">
                        {feature.code}
                    </div>
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
