"use client";

import { siteConfig } from "@/app/siteConfig";
import { documentation, github, social } from "@/lib/links";
import { RiCloseLine, RiGithubFill, RiMenuLine } from "@remixicon/react";
import { cx } from "@/lib/utils";
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
  const [stars, setStars] = React.useState();
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === siteConfig.baseLinks.home;

  React.useEffect(() => {
    const mediaQuery: MediaQueryList = window.matchMedia("(min-width: 768px)");
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
          setStars(data.stargazers_count);
        }
      } catch {
        // Non-critical: star count is decorative
      }
    }

    fetchStars();
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
              "relative flex items-center justify-between h-16 md:h-20 shrink-0",
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
            <nav className="hidden md:absolute md:left-1/2 md:top-1/2 md:block md:-translate-x-1/2 md:-translate-y-1/2 md:transform">
              <div className="flex items-center gap-6 text-sm font-medium">
                <Link
                  className={cx(
                    "px-2 py-1 transition-colors",
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
                  target="_blank"
                  className={cx(
                    "px-2 py-1 transition-colors",
                    isHomePage && !open
                      ? "text-white/90 hover:text-white"
                      : isHomePage && open
                        ? "text-slate-900 dark:text-white"
                        : "text-indigo-900 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white",
                  )}
                  href={documentation.BASE}
                >
                  Documentation
                </Link>
                <Link
                  className={cx(
                    "px-2 py-1 transition-colors",
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
                    "px-2 py-1 transition-colors",
                    isHomePage && !open
                      ? "text-white/90 hover:text-white"
                      : isHomePage && open
                        ? "text-slate-900 dark:text-white"
                        : "text-indigo-900 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white",
                  )}
                  href={social.SLACK}
                >
                  Community
                </Link>
              </div>
            </nav>
            <div className="flex items-center gap-3 sm:gap-6 md:mr-1">
              <div className="hidden md:flex">
                <ThemeToggle
                  variant={isHomePage && !open ? "white" : "default"}
                />
              </div>
              <Link
                href={github.REPO}
                target="_blank"
                className={cx(
                  "items-center justify-center space-x-2 transition-all duration-300",
                  stars && !open ? "flex opacity-100" : "hidden opacity-0",
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
                    "text-sm font-medium transition-colors",
                    isHomePage && !open
                      ? "text-white"
                      : "text-slate-900 dark:text-slate-100",
                  )}
                >
                  {formatStarCount(stars ?? 0)}
                </div>
              </Link>
              <Button
                className={cx(
                  "hidden px-4 md:flex rounded-none transition-all",
                  isHomePage && !open
                    ? "bg-white text-indigo-600 hover:bg-indigo-50 border-0 shadow-none"
                    : "border-indigo-200 dark:border-indigo-600 ring-2 ring-indigo-400 dark:ring-indigo-600/50 border-1 bg-indigo-600 dark:bg-indigo-600 text-white shadow-none",
                )}
              >
                <Link target="_blank" href={social.CALENDLY}>
                  Book a Demo
                </Link>
              </Button>
              <div className="md:hidden">
                <Button
                  onClick={() => setOpen(!open)}
                  variant="ghost"
                  className={cx(
                    "aspect-square p-2 transition-colors border-0 hover:bg-transparent",
                    isHomePage && !open
                      ? "text-white hover:text-white/80"
                      : "text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400",
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
            className={cx("flex flex-col md:hidden", open ? "pb-8" : "hidden")}
          >
            <ul className="flex flex-col font-semibold w-full">
              <li onClick={() => setOpen(false)} className="w-full px-6">
                <Link
                  target="_blank"
                  href={documentation.BASE}
                  className={cx(
                    "block w-full py-5 border-b border-slate-100 dark:border-slate-900 text-lg tracking-tight",
                    "text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors",
                  )}
                >
                  Documentation
                </Link>
              </li>
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
                  href={social.SLACK}
                  className={cx(
                    "block w-full py-5 text-lg tracking-tight",
                    "text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors",
                  )}
                >
                  Community
                </Link>
              </li>
              <li className="pt-6 px-6">
                <Button
                  asChild
                  className="w-full h-12 !rounded-none bg-indigo-600 text-white font-bold border-0 shadow-none text-md"
                >
                  <Link target="_blank" href={social.CALENDLY}>
                    Book a Demo
                  </Link>
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
