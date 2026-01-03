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
      className="group bg-transparent px-0 text-gray-600 dark:text-slate-400 hover:bg-transparent"
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
      className="group bg-transparent px-0 text-gray-600 dark:text-slate-400 hover:bg-transparent"
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
      <section className="border-t border-slate-200 dark:border-slate-900 overflow-hidden flex flex-col relative">
        {/* Outer Vertical Layout Borders */}
        <div className="absolute inset-y-0 left-2 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-2 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        {/* Inner Vertical Borders for boxed look */}
        <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
        <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />

        <div className={classNames("mx-auto flex relative z-20", isBlogIndex ? "w-full" : "max-w-[1128px]")}>
          {isBlogIndex && (
            <div className="absolute inset-y-0 left-2 md:left-12 right-2 md:right-12 bg-slate-100 dark:bg-slate-950/50 -z-10" />
          )}
          {!isBlogIndex && (
            <div className="hidden lg:flex lg:w-80 lg:flex-col border-r border-slate-200 dark:border-slate-900">
              {/* Sidebar component */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7 mt-4">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {blogLinks.map((item) => (
                          <li key={item.href}>
                            <a
                              href={`${siteConfig.baseLinks.blog}/${item.href}`}
                              className={classNames(
                                pathname.endsWith(item.href)
                                  ? "bg-gray-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400"
                                  : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
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
          <main className={classNames("w-full", isBlogIndex ? "px-0" : "px-6 py-4 md:py-0")}>
            {!isBlogIndex && (
              <div className="mx-auto flex justify-between">
                <div>{canGoBackward && <BackButton href={previousHref} />}</div>
                <div>{canGoForward && <NextButton href={nextHref} />}</div>
              </div>
            )}
            <div className={classNames("w-full", !isBlogIndex && "py-4")}>{children}</div>
            {!isBlogIndex && (
              <div className="mx-auto flex justify-between">
                <div>{canGoBackward && <BackButton href={previousHref} />}</div>
                <div>{canGoForward && <NextButton href={nextHref} />}</div>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}
