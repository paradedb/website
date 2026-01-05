"use client";

import { Button } from "@/components/Button";
import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import CodeBlockEnhancer from "@/components/CodeBlockEnhancer";
import { BlogLink } from "@/lib/blog";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  blogLinks,
}: {
  children: React.ReactNode;
  blogLinks: BlogLink[];
}) {
  const pathname = usePathname();
  const isBlogIndex = pathname === siteConfig.baseLinks.blog;
  const currentPageIdx = blogLinks.findIndex((item) =>
    pathname.endsWith(item.href),
  );
  const canGoBackward = !isBlogIndex && currentPageIdx > 0;
  const canGoForward = !isBlogIndex && currentPageIdx < blogLinks.length - 1;
  const nextHref = canGoForward
    ? `${siteConfig.baseLinks.blog}/${blogLinks[currentPageIdx + 1].href}`
    : "";
  const previousHref = canGoBackward
    ? `${siteConfig.baseLinks.blog}/${blogLinks[currentPageIdx - 1].href}`
    : "";

  return (
    <div className="w-full opacity-0 animate-fade-in delay-300">
      <section className="bg-white dark:bg-slate-950 flex flex-col relative">
        {/* Shaded Hatch Region below navbar */}
        <div className="px-4 md:px-12 w-full relative z-20">
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-b border-x border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50" />
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
        {isBlogIndex ? (
          <>
            <div className="absolute bottom-8 md:bottom-12 top-8 md:top-12 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
            <div className="absolute bottom-8 md:bottom-12 top-8 md:top-12 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
          </>
        ) : (
          <>
            <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
            <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
          </>
        )}

        <div className="flex relative z-20 w-full px-4 md:px-12">
          {!isBlogIndex && (
            <div className="hidden lg:flex lg:w-80 lg:flex-col transition-colors border-r border-slate-100 dark:border-slate-900 pt-8">
              {/* Sidebar component - Sticky positioning */}
              <div className="sticky top-8 flex flex-col gap-y-5 px-6 pb-10">
                <nav className="flex flex-1 flex-col">
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-4 mt-0 px-2">
                    Latest Posts
                  </div>
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {blogLinks.map((item) => (
                          <li key={item.href}>
                            <a
                              href={`${siteConfig.baseLinks.blog}/${item.href}`}
                              className={classNames(
                                pathname.endsWith(item.href)
                                  ? "bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold"
                                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-5 transition-all duration-200",
                              )}
                            >
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}

          {/* Blog content */}
          <main
            className={classNames(
              "w-full relative flex flex-col",
              isBlogIndex ? "px-0" : "px-4 md:px-12 pt-8 pb-4",
            )}
          >
            <div
              className={classNames(
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
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-t border-x border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50" />
        </div>
      </section>
      <CodeBlockEnhancer />
    </div>
  );
}
