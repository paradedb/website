"use client";

import { siteConfig } from "@/app/siteConfig";
import { documentation, github, social } from "@/lib/links";
import {
  RiArrowRightUpLine,
  RiCloseLine,
  RiGithubFill,
  RiMenuLine,
} from "@remixicon/react";
import { cx } from "@/lib/utils";
import { isLandingRoute } from "@/lib/landing";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { DatabaseLogo } from "./DatabaseLogo";
import { Button } from "../Button";
import { ThemeToggle } from "./ThemeToggle";

const formatStarCount = (count: number) => {
  if (count < 1000) {
    return count;
  } else {
    return `${(count / 1000).toFixed(1)}K`;
  }
};

export function Navigation() {
  const [stars, setStars] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  // Landing routes ("/" and /preview/*) get the hero-overlay navbar treatment.
  const isHomePage = isLandingRoute(pathname);

  React.useEffect(() => {
    const mediaQuery: MediaQueryList = window.matchMedia("(min-width: 900px)");
    const handleMediaQueryChange = () => {
      setOpen(false);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    handleMediaQueryChange();

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  React.useEffect(() => {
    async function fetchStars() {
      try {
        const response = await fetch(github.API);
        if (response.ok) {
          const data = await response.json();
          if (typeof data.stargazers_count === "number") {
            setStars(data.stargazers_count);
          }
        }
      } catch {
        // Non-critical: star count is decorative
      }
    }

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (typeof requestIdleCallback === "function") {
      idleId = requestIdleCallback(() => {
        void fetchStars();
      });
    } else {
      timeoutId = setTimeout(() => {
        void fetchStars();
      }, 2000);
    }

    return () => {
      if (idleId !== undefined && typeof cancelIdleCallback === "function") {
        cancelIdleCallback(idleId);
      }

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div
      className={cx(
        "w-full z-50",
        isHomePage ? "absolute top-0" : "relative h-16 md:h-20",
      )}
    >
      <header
        className={cx(
          "z-50 flex transform-gpu opacity-0 animate-navbar justify-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform",
          "left-4 md:left-12 right-4 md:right-12 absolute border-b",
          isHomePage
            ? "border-white/20"
            : "border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md",
          open === true
            ? "h-auto pb-8 pt-2 top-2 rounded-2xl"
            : "h-16 md:h-20 top-0",
          open === true
            ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl shadow-2xl shadow-black/10"
            : "bg-transparent",
        )}
      >
        <div className="w-full flex flex-col justify-start">
          <div
            className={cx(
              "relative grid grid-cols-[auto_1fr_auto] items-center gap-4 h-16 md:h-20 shrink-0 min-[1200px]:gap-6",
              open ? "px-6" : "px-0",
            )}
          >
            <Link href={siteConfig.baseLinks.home} aria-label="Home">
              <span className="sr-only">Company logo</span>
              <DatabaseLogo
                className={cx(
                  "w-28 sm:w-32 transition-colors",
                  isHomePage && !open
                    ? "brightness-0 invert"
                    : "dark:brightness-0 dark:invert",
                )}
              />
            </Link>
            <nav className="hidden min-w-0 justify-self-center min-[900px]:block">
              <div className="flex min-w-0 items-center gap-2 text-sm font-medium whitespace-nowrap min-[1200px]:gap-4 min-[1400px]:gap-6">
                <Link
                  className={cx(
                    "px-1 py-1 transition-colors min-[1200px]:px-1.5 min-[1400px]:px-2",
                    pathname.startsWith(siteConfig.baseLinks.blog)
                      ? "text-indigo-600 dark:text-white"
                      : isHomePage && !open
                        ? "text-white/90 hover:text-white"
                        : isHomePage && open
                          ? "text-slate-900 dark:text-white"
                          : "text-indigo-900 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white",
                  )}
                  href={siteConfig.baseLinks.blog}
                >
                  Blog
                </Link>
                <Link
                  className={cx(
                    "px-1 py-1 transition-colors min-[1200px]:px-1.5 min-[1400px]:px-2",
                    pathname.startsWith(siteConfig.baseLinks.customers)
                      ? "text-indigo-600 dark:text-white"
                      : isHomePage && !open
                        ? "text-white/90 hover:text-white"
                        : isHomePage && open
                          ? "text-slate-900 dark:text-white"
                          : "text-indigo-900 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white",
                  )}
                  href={siteConfig.baseLinks.customers}
                >
                  Customers
                </Link>
                <Link
                  className={cx(
                    "px-1 py-1 transition-colors min-[1200px]:px-1.5 min-[1400px]:px-2",
                    pathname.startsWith(siteConfig.baseLinks.resources)
                      ? "text-indigo-600 dark:text-white"
                      : isHomePage && !open
                        ? "text-white/90 hover:text-white"
                        : isHomePage && open
                          ? "text-slate-900 dark:text-white"
                          : "text-indigo-900 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white",
                  )}
                  href={siteConfig.baseLinks.resources}
                >
                  Learn
                </Link>
                <Link
                  target="_blank"
                  className={cx(
                    "px-1 py-1 transition-colors inline-flex items-center gap-1 min-[1200px]:px-1.5 min-[1400px]:px-2",
                    isHomePage && !open
                      ? "text-white/90 hover:text-white"
                      : isHomePage && open
                        ? "text-slate-900 dark:text-white"
                        : "text-indigo-900 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white",
                  )}
                  href={documentation.BASE}
                >
                  Documentation
                  <div
                    className={cx(
                      "ml-1 aspect-square size-3 rounded-full p-px",
                      isHomePage
                        ? "bg-white/10"
                        : "bg-gray-100 dark:bg-slate-800",
                    )}
                  >
                    <RiArrowRightUpLine
                      aria-hidden="true"
                      className={cx(
                        "size-full shrink-0 -translate-y-px",
                        isHomePage
                          ? "text-white"
                          : "text-gray-900 dark:text-slate-100",
                      )}
                    />
                  </div>
                </Link>
                <Link
                  target="_blank"
                  className={cx(
                    "px-1 py-1 transition-colors inline-flex items-center gap-1 min-[1200px]:px-1.5 min-[1400px]:px-2",
                    isHomePage && !open
                      ? "text-white/90 hover:text-white"
                      : isHomePage && open
                        ? "text-slate-900 dark:text-white"
                        : "text-indigo-900 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white",
                  )}
                  href={social.SLACK}
                >
                  Community
                  <div
                    className={cx(
                      "ml-1 aspect-square size-3 rounded-full p-px",
                      isHomePage
                        ? "bg-white/10"
                        : "bg-gray-100 dark:bg-slate-800",
                    )}
                  >
                    <RiArrowRightUpLine
                      aria-hidden="true"
                      className={cx(
                        "size-full shrink-0 -translate-y-px",
                        isHomePage
                          ? "text-white"
                          : "text-gray-900 dark:text-slate-100",
                      )}
                    />
                  </div>
                </Link>
              </div>
            </nav>
            <div className="flex items-center justify-end md:mr-1">
              <div className="hidden min-[900px]:flex min-[900px]:items-center min-[900px]:justify-end min-[900px]:gap-2 min-[1200px]:gap-3 min-[1400px]:gap-6">
                <div className="flex items-center gap-2 min-[1200px]:gap-3 min-[1400px]:gap-6">
                  <ThemeToggle
                    variant={isHomePage && !open ? "white" : "default"}
                  />
                  <Link
                    href={github.REPO}
                    target="_blank"
                    aria-label="GitHub repository"
                    className={cx(
                      "flex items-center justify-center space-x-2 transition-all duration-300",
                      open ? "opacity-0" : "opacity-100",
                    )}
                  >
                    <RiGithubFill
                      aria-hidden="true"
                      className={cx(
                        "size-6 shrink-0 transition-colors",
                        isHomePage && !open
                          ? "text-white"
                          : "text-slate-900 dark:text-slate-100",
                      )}
                    />
                    <div
                      className={cx(
                        "hidden text-sm font-medium transition-opacity duration-300 min-[1200px]:block",
                        isHomePage && !open
                          ? "text-white"
                          : "text-slate-900 dark:text-slate-100",
                        stars ? "opacity-100" : "opacity-0",
                      )}
                      aria-hidden={stars ? undefined : true}
                    >
                      {formatStarCount(stars ?? 0)}
                    </div>
                  </Link>
                </div>
                <Button
                  asChild
                  className={cx(
                    "px-3 rounded-none transition-all min-[1200px]:px-4",
                    isHomePage && !open
                      ? "bg-white text-indigo-600 hover:bg-indigo-50 border-0 shadow-none"
                      : "border-indigo-200 dark:border-indigo-600 ring-2 ring-indigo-400 dark:ring-indigo-600/50 border-1 bg-indigo-600 dark:bg-indigo-600 text-white shadow-none",
                  )}
                >
                  <a href="mailto:hello@paradedb.com">Contact Us</a>
                </Button>
              </div>
              <div className="min-[900px]:hidden">
                <Button
                  onClick={() => setOpen(!open)}
                  variant="ghost"
                  className={cx(
                    "aspect-square p-2 transition-colors border-0 hover:bg-transparent",
                    isHomePage && !open
                      ? "text-white hover:text-white/80"
                      : "text-slate-900 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300",
                  )}
                >
                  {open ? (
                    <RiCloseLine aria-hidden="true" className="size-5" />
                  ) : (
                    <RiMenuLine aria-hidden="true" className="size-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <nav
            className={cx(
              "flex flex-col min-[900px]:hidden",
              open ? "pb-8" : "hidden",
            )}
          >
            <ul className="flex flex-col font-semibold w-full">
              <li onClick={() => setOpen(false)} className="w-full px-6">
                <Link
                  href={siteConfig.baseLinks.blog}
                  className={cx(
                    "block w-full py-5 border-b border-slate-100 dark:border-slate-900 text-lg tracking-tight",
                    "text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors",
                  )}
                >
                  Blog
                </Link>
              </li>
              <li onClick={() => setOpen(false)} className="w-full px-6">
                <Link
                  href={siteConfig.baseLinks.customers}
                  className={cx(
                    "block w-full py-5 border-b border-slate-100 dark:border-slate-900 text-lg tracking-tight",
                    "text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors",
                  )}
                >
                  Customers
                </Link>
              </li>
              <li onClick={() => setOpen(false)} className="w-full px-6">
                <Link
                  href={siteConfig.baseLinks.resources}
                  className={cx(
                    "block w-full py-5 border-b border-slate-100 dark:border-slate-900 text-lg tracking-tight",
                    "text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors",
                  )}
                >
                  Learn
                </Link>
              </li>
              <li onClick={() => setOpen(false)} className="w-full px-6">
                <Link
                  target="_blank"
                  href={documentation.BASE}
                  className={cx(
                    "w-full py-5 border-b border-slate-100 dark:border-slate-900 text-lg tracking-tight inline-flex items-center gap-1",
                    "text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors",
                  )}
                >
                  Documentation
                  <div className="ml-1 aspect-square size-3 rounded-full p-px bg-gray-100 dark:bg-slate-800">
                    <RiArrowRightUpLine
                      aria-hidden="true"
                      className="size-full shrink-0 -translate-y-px text-gray-900 dark:text-slate-100"
                    />
                  </div>
                </Link>
              </li>
              <li onClick={() => setOpen(false)} className="w-full px-6">
                <Link
                  target="_blank"
                  href={social.SLACK}
                  className={cx(
                    "w-full py-5 border-b border-slate-100 dark:border-slate-900 text-lg tracking-tight inline-flex items-center gap-1",
                    "text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors",
                  )}
                >
                  Community
                  <div className="ml-1 aspect-square size-3 rounded-full p-px bg-gray-100 dark:bg-slate-800">
                    <RiArrowRightUpLine
                      aria-hidden="true"
                      className="size-full shrink-0 -translate-y-px text-gray-900 dark:text-slate-100"
                    />
                  </div>
                </Link>
              </li>
              <li onClick={() => setOpen(false)} className="w-full px-6">
                <Link
                  target="_blank"
                  href={github.REPO}
                  className={cx(
                    "w-full py-5 text-lg tracking-tight inline-flex items-center gap-2",
                    "text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors",
                  )}
                >
                  <RiGithubFill aria-hidden="true" className="size-5" />
                  GitHub
                </Link>
              </li>
              <li className="pt-6 px-6">
                <Button
                  asChild
                  className="w-full h-12 !rounded-none bg-indigo-600 text-white font-bold border-0 shadow-none text-md"
                >
                  <a href="mailto:hello@paradedb.com">Contact Us</a>
                </Button>
              </li>
              <li className="flex justify-center pt-6">
                <ThemeToggle variant="default" />
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}
