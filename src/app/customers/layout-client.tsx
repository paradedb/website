"use client";

import CodeBlockEnhancer from "@/components/CodeBlockEnhancer";
import { BlogLink } from "@/lib/blog";
import { cx } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "../siteConfig";

export default function CustomersLayoutClient({
  children,
  caseStudies,
}: {
  children: React.ReactNode;
  caseStudies: BlogLink[];
}) {
  const pathname = usePathname();
  const isCustomersIndex = pathname === siteConfig.baseLinks.customers;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="w-full relative opacity-0 animate-fade-in delay-300 bg-white dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto relative w-full">
        <section className="bg-white dark:bg-slate-950 flex flex-col relative">
          {/* Shaded Hatch Region below navbar */}
          <div className="px-4 md:px-12 w-full relative z-20">
            <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-b border-x border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />
          </div>

          {/* Outer Vertical Layout Borders */}
          <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
          <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

          {/* Mobile Browse Case Studies dropdown */}
          <div className="lg:hidden px-4 md:px-12 w-full relative z-30">
            <div className="border-b border-slate-100 dark:border-slate-900">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="flex w-full items-center justify-between px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <span>Browse Case Studies</span>
                <svg
                  className={cx(
                    "h-4 w-4 transform transition-transform text-slate-400",
                    mobileNavOpen ? "rotate-90" : "rotate-0",
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {mobileNavOpen && (
                <div className="px-4 pb-4">
                  <ul role="list" className="space-y-1">
                    {caseStudies.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={`${siteConfig.baseLinks.blog}/${item.href}`}
                          onClick={() => setMobileNavOpen(false)}
                          className={cx(
                            "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-5 transition-all duration-200",
                          )}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex relative z-20 w-full px-4 md:px-12">
            <div className="hidden lg:flex lg:w-80 lg:shrink-0 lg:flex-col transition-colors border-r border-slate-100 dark:border-slate-900">
              {/* Sidebar component - Sticky positioning */}
              <div className="sticky top-0 max-h-screen overflow-y-auto flex flex-col gap-y-5 px-6 pt-8 pb-10">
                <nav className="flex flex-1 flex-col text-slate-900 dark:text-white">
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-4 mt-0 px-2">
                    Case Studies
                  </div>
                  <ul role="list" className="flex flex-1 flex-col space-y-1">
                    {caseStudies.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={`${siteConfig.baseLinks.blog}/${item.href}`}
                          className={cx(
                            "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-5 transition-all duration-200",
                          )}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* Customers content */}
            <main
              className={cx(
                "relative flex flex-col",
                isCustomersIndex
                  ? "w-full lg:flex-1 lg:min-w-0 px-0"
                  : "flex-1 min-w-0 pl-4 md:pl-12 pr-0 pt-8 pb-4",
              )}
            >
              <div
                className={cx(
                  "w-full mx-auto",
                  isCustomersIndex ? "" : "max-w-none",
                )}
              >
                <div className="w-full">{children}</div>
              </div>
            </main>
          </div>

          {/* Shaded Hatch Region above footer */}
          <div className="px-4 md:px-12 w-full relative z-20">
            <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-t border-x border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />
          </div>
        </section>
        <CodeBlockEnhancer />
      </div>
    </div>
  );
}
