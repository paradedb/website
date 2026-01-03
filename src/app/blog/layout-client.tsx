"use client";

import { Button } from "@/components/Button";
import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
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
      <ArrowAnimated className="stroke-gray-600 dark:stroke-slate-400" aria-hidden="true" />
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
    <div className="w-full">
      <section className={classNames("border-t border-slate-200 dark:border-slate-900 overflow-hidden flex flex-col relative", isBlogIndex ? "" : "bg-white dark:bg-slate-950")}>
        {/* Outer Vertical Layout Borders */}
        {isBlogIndex && (
          <>
            <div className="absolute inset-y-0 left-2 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
            <div className="absolute inset-y-0 right-2 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
          </>
        )}

        {/* Background color layer */}
        {isBlogIndex && (
          <div className="absolute inset-y-0 left-2 md:left-12 right-2 md:right-12 bg-[#f1f5f9] dark:bg-slate-950/50 -z-10" />
        )}

        {/* Inner Vertical Borders for boxed look */}
        {isBlogIndex && (
          <>
            <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
            <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
          </>
        )}

        <div className={classNames("mx-auto flex relative z-20 w-full", isBlogIndex ? "lg:max-w-[1128px]" : "mx-2 md:mx-12")}>
          {!isBlogIndex && (
            <div className="hidden lg:flex lg:w-80 lg:flex-col transition-colors border-r border-slate-100 dark:border-slate-900">
              {/* Sidebar component */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-10">
                <nav className="flex flex-1 flex-col">
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-4 mt-12 px-2">
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
          <main className={classNames("w-full relative flex flex-col", isBlogIndex ? "px-0" : "px-6 md:px-12 py-2 md:py-4")}>
            <div className={classNames("w-full mx-auto", isBlogIndex ? "" : "max-w-4xl")}>
              {!isBlogIndex && (
                <div className="mb-6 flex justify-between border-b border-slate-100 dark:border-slate-900 pb-4">
                  <div>{canGoBackward && <BackButton href={previousHref} />}</div>
                  <div>{canGoForward && <NextButton href={nextHref} />}</div>
                </div>
              )}
              <div className="w-full">{children}</div>
              {!isBlogIndex && (
                <div className="mt-20 pt-8 flex justify-between border-t border-slate-100 dark:border-slate-900">
                  <div>{canGoBackward && <BackButton href={previousHref} />}</div>
                  <div>{canGoForward && <NextButton href={nextHref} />}</div>
                </div>
              )}
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}
