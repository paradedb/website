"use client";

import { ResourceSection } from "@/lib/resources";
import { cx } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "../siteConfig";
import CodeBlockEnhancer from "@/components/CodeBlockEnhancer";
import { Button } from "@/components/Button";
import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import Link from "next/link";

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
      <div>Previous</div>
    </Button>
  </Link>
);

const NextButton = ({ href }: { href: string }) => (
  <Link href={href}>
    <Button
      className="group bg-transparent px-0 text-gray-600 dark:text-slate-400 hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
      variant="light"
    >
      Next
      <ArrowAnimated
        className="stroke-gray-600 dark:stroke-slate-400"
        aria-hidden="true"
      />
    </Button>
  </Link>
);

export default function ResourcesLayoutClient({
  children,
  resourceSections,
}: {
  children: React.ReactNode;
  resourceSections: ResourceSection[];
}) {
  const pathname = usePathname();
  const isLearnIndex = pathname === siteConfig.baseLinks.resources;
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

  // Flatten all resources from all sections to calculate next/prev
  const allResources = resourceSections.flatMap((section) => section.resources);
  const currentResourceIdx = allResources.findIndex((item) =>
    pathname.endsWith(item.href),
  );

  const canGoBackward = !isLearnIndex && currentResourceIdx > 0;
  const canGoForward =
    !isLearnIndex && currentResourceIdx < allResources.length - 1;
  const nextHref = canGoForward
    ? `${siteConfig.baseLinks.resources}/${allResources[currentResourceIdx + 1].href}`
    : "";
  const previousHref = canGoBackward
    ? `${siteConfig.baseLinks.resources}/${allResources[currentResourceIdx - 1].href}`
    : "";

  // Find current resource info for breadcrumbs (using flattened list for consistency)
  const currentResource = allResources[currentResourceIdx];

  return (
    <div className="w-full relative opacity-0 animate-fade-in delay-300 bg-white dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto relative w-full">
        <section className="bg-white dark:bg-slate-950 flex flex-col relative">
          {/* Shaded Hatch Region below navbar */}
          <div className="px-4 md:px-12 w-full relative z-20">
            <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-b border-x border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />
          </div>

          {/* Learn Navigation - Top Bar */}
          {!isLearnIndex && (
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
          {isLearnIndex && (
            <>
              <div className="absolute bottom-8 md:bottom-12 top-8 md:top-12 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
              <div className="absolute bottom-8 md:bottom-12 top-8 md:top-12 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
            </>
          )}

          {/* Full-height Outer Vertical Layout Borders for non-index */}
          {!isLearnIndex && (
            <>
              <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
              <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
            </>
          )}

          <div className="flex relative z-20 w-full px-4 md:px-12">
            {!isLearnIndex && (
              <div className="hidden lg:flex lg:w-80 lg:shrink-0 lg:flex-col transition-colors border-r border-slate-100 dark:border-slate-900 pt-8">
                {/* Sidebar component */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-10">
                  <nav className="flex flex-1 flex-col text-slate-900 dark:text-white">
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-4 mt-0 px-2">
                      Learning Resources
                    </div>
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      {resourceSections.map((section) => (
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
                              {section.resources.map((item) => (
                                <li key={item.href}>
                                  <a
                                    href={`${siteConfig.baseLinks.resources}/${item.href}`}
                                    className={cx(
                                      pathname.endsWith(item.href)
                                        ? "bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400",
                                      "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-5 transition-all duration-200",
                                    )}
                                  >
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">
                                        {item.name}
                                      </span>
                                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold mt-0.5">
                                        {item.type}
                                      </span>
                                    </div>
                                  </a>
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
            )}

            <main
              className={cx(
                "relative flex flex-col",
                isLearnIndex
                  ? "w-full px-0"
                  : "flex-1 min-w-0 pl-4 md:pl-12 pr-0 pt-8 pb-4",
              )}
            >
              <div
                className={cx(
                  "mx-auto w-full",
                  isLearnIndex ? "" : "max-w-none",
                )}
              >
                {/* Mobile back navigation */}
                {!isLearnIndex && currentResource && (
                  <nav className="lg:hidden mb-8">
                    <a
                      href="/learn"
                      className="flex items-center text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <span className="mr-2 text-indigo-500">←</span>
                      Back to Learn
                    </a>
                  </nav>
                )}

                <div className="w-full">{children}</div>
              </div>
            </main>
          </div>

          {/* Learn Navigation - Bottom Bar */}
          {!isLearnIndex && (
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
