"use client";

import { Button } from "@/components/Button";
import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import CodeBlockEnhancer from "@/components/CodeBlockEnhancer";
import { BlogSection } from "@/lib/blog";
import { cx } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "../siteConfig";

const BackButton = ({ href }: { href: string }) => (
  <Link href={href}>
    <Button
      className="group bg-transparent px-0 text-gray-600 dark:text-slate-400 hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
      variant="light"
    >
      <ArrowAnimated
        className="relative right-3 rotate-180 transform stroke-gray-600 dark:stroke-slate-400"
        aria-hidden="true"
      />
      <div>Previous Post</div>
    </Button>
  </Link>
);

const NextButton = ({ href }: { href: string }) => (
  <Link href={href}>
    <Button
      className="group bg-transparent px-0 text-gray-600 dark:text-slate-400 hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
      variant="light"
    >
      Next Post
      <ArrowAnimated
        className="stroke-gray-600 dark:stroke-slate-400"
        aria-hidden="true"
      />
    </Button>
  </Link>
);

export default function BlogLayoutClient({
  children,
  blogSections,
}: {
  children: React.ReactNode;
  blogSections: BlogSection[];
}) {
  const pathname = usePathname();
  const isBlogIndex = pathname === siteConfig.baseLinks.blog;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  );

  const toggleSection = (sectionName: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionName)) {
      newCollapsed.delete(sectionName);
    } else {
      newCollapsed.add(sectionName);
    }
    setCollapsedSections(newCollapsed);
  };

  const allLinks = blogSections.flatMap((section) => section.links);
  const currentPageIdx = allLinks.findIndex((item) =>
    pathname.endsWith(item.href),
  );
  const canGoBackward = !isBlogIndex && currentPageIdx > 0;
  const canGoForward = !isBlogIndex && currentPageIdx < allLinks.length - 1;
  const nextHref = canGoForward
    ? `${siteConfig.baseLinks.blog}/${allLinks[currentPageIdx + 1].href}`
    : "";
  const previousHref = canGoBackward
    ? `${siteConfig.baseLinks.blog}/${allLinks[currentPageIdx - 1].href}`
    : "";

  return (
    <div className="w-full relative opacity-0 animate-fade-in delay-300 bg-white dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto relative w-full">
        <section className="bg-white dark:bg-slate-950 flex flex-col relative">
          {/* Shaded Hatch Region below navbar */}
          <div className="px-4 md:px-12 w-full relative z-20">
            <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-b border-x border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />
          </div>

          {/* Blog Navigation - Top Bar */}
          {!isBlogIndex && (
            <div className="px-4 md:px-12 w-full relative z-30">
              <div className="border-b border-slate-100 dark:border-slate-900 flex justify-between items-center h-12 px-6">
                <div className="flex items-center">
                  {canGoBackward && <BackButton href={previousHref} />}
                </div>
                <div className="flex items-center">
                  {canGoForward && <NextButton href={nextHref} />}
                </div>
              </div>
            </div>
          )}

          {/* Outer Vertical Layout Borders */}
          <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
          <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

          {/* Mobile Browse Posts dropdown */}
          <div className="lg:hidden px-4 md:px-12 w-full relative z-30">
            <div className="border-b border-slate-100 dark:border-slate-900">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="flex w-full items-center justify-between px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <span>Browse Posts</span>
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
                  <ul role="list" className="space-y-4">
                    {blogSections.map((section) => (
                      <li key={section.name}>
                        <button
                          onClick={() => toggleSection(section.name)}
                          className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                        >
                          <span>{section.name}</span>
                          <svg
                            className={cx(
                              "h-4 w-4 transform transition-transform text-slate-400",
                              collapsedSections.has(section.name)
                                ? "rotate-0"
                                : "rotate-90",
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
                        {!collapsedSections.has(section.name) && (
                          <ul role="list" className="mt-2 space-y-1 pl-4">
                            {section.links.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={`${siteConfig.baseLinks.blog}/${item.href}`}
                                  onClick={() => setMobileNavOpen(false)}
                                  className={cx(
                                    pathname.endsWith(item.href)
                                      ? "bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold"
                                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400",
                                    "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-5 transition-all duration-200",
                                  )}
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
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
                    Blog Posts
                  </div>
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    {blogSections.map((section) => (
                      <li key={section.name}>
                        <button
                          onClick={() => toggleSection(section.name)}
                          className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                        >
                          <span>{section.name}</span>
                          <svg
                            className={cx(
                              "h-4 w-4 transform transition-transform text-slate-400",
                              collapsedSections.has(section.name)
                                ? "rotate-0"
                                : "rotate-90",
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
                        {!collapsedSections.has(section.name) && (
                          <ul role="list" className="mt-2 space-y-1 pl-4">
                            {section.links.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={`${siteConfig.baseLinks.blog}/${item.href}`}
                                  className={cx(
                                    pathname.endsWith(item.href)
                                      ? "bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold"
                                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400",
                                    "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-5 transition-all duration-200",
                                  )}
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* Blog content */}
            <main
              className={cx(
                "relative flex flex-col",
                isBlogIndex
                  ? "w-full lg:flex-1 lg:min-w-0 px-0"
                  : "flex-1 min-w-0 pl-4 md:pl-12 pr-0 pt-8 pb-4",
              )}
            >
              <div
                className={cx(
                  "w-full mx-auto",
                  isBlogIndex ? "" : "max-w-none",
                )}
              >
                <div className="w-full">{children}</div>
              </div>
            </main>
          </div>

          {/* Blog Navigation - Bottom Bar */}
          {!isBlogIndex && (
            <div className="px-4 md:px-12 w-full relative z-30">
              <div className="border-t border-slate-100 dark:border-slate-900 flex justify-between items-center h-16 px-6">
                <div className="flex items-center">
                  {canGoBackward && <BackButton href={previousHref} />}
                </div>
                <div className="flex items-center">
                  {canGoForward && <NextButton href={nextHref} />}
                </div>
              </div>
            </div>
          )}

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
