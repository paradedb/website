"use client";

import { siteConfig } from "@/app/siteConfig";
import { documentation, github, social } from "@/lib/links";
import { RiCloseLine, RiGithubFill, RiMenuLine } from "@remixicon/react";
import classNames from "classnames";
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
      } catch (error) {}
    }

    fetchStars();
  }, []);

  return (
    <div
      className={classNames(
        "w-full z-50",
        isHomePage ? "absolute top-0" : "relative h-16 md:h-20",
      )}
    >
      <header
        className={classNames(
          "z-50 flex transform-gpu animate-slide-down-fade justify-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform",
          "left-4 md:left-12 right-4 md:right-12 absolute border-b",
          isHomePage
            ? "border-white/20"
            : "border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md",
          open === true ? "h-52" : "h-16 md:h-20",
          open === true
            ? classNames(
                "backdrop-blur-nav max-w-3xl border-gray-100 dark:border-slate-800 shadow-xl shadow-black/5",
                isHomePage
                  ? "bg-white/95 dark:bg-slate-950/95"
                  : "bg-white/80 dark:bg-slate-900/80",
              )
            : "bg-transparent",
        )}
      >
        <div className="w-full my-auto px-0">
          <div className="relative flex items-center justify-between">
            <Link href={siteConfig.baseLinks.home} aria-label="Home">
              <span className="sr-only">Company logo</span>
              <DatabaseLogo
                className={classNames(
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
                  className={classNames(
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
                  className={classNames(
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
                  className={classNames(
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
                  className={classNames(
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
                className={classNames(
                  "flex items-center justify-center space-x-2 transition-all duration-300",
                  stars ? "opacity-100" : "opacity-0",
                )}
              >
                <RiGithubFill
                  aria-hidden="true"
                  className={classNames(
                    "size-6 shrink-0 transition-colors",
                    isHomePage && !open
                      ? "text-white"
                      : "text-slate-900 dark:text-slate-100",
                  )}
                />
                <div
                  className={classNames(
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
                className={classNames(
                  "hidden px-4 md:flex rounded-none transition-all",
                  isHomePage && !open
                    ? "bg-white text-indigo-600 hover:bg-indigo-50 border-0"
                    : "border-indigo-200 dark:border-indigo-600 ring-2 ring-indigo-400 dark:ring-indigo-600/50 border-1 bg-indigo-600 dark:bg-indigo-600 text-white",
                )}
              >
                <Link target="_blank" href={social.CALENDLY}>
                  Book a Demo
                </Link>
              </Button>
              <div className="md:hidden">
                <Button
                  onClick={() => setOpen(!open)}
                  variant="light"
                  className={classNames(
                    "aspect-square bg-opacity-0 p-2 transition-colors",
                    isHomePage && !open
                      ? "text-white"
                      : "text-slate-900 dark:text-slate-100",
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
            className={classNames(
              "my-6 flex text-lg ease-in-out will-change-transform md:hidden",
              open ? "" : "hidden",
            )}
          >
            <ul className="space-y-4 font-medium">
              <li onClick={() => setOpen(false)}>
                <Link
                  target="_blank"
                  href={documentation.BASE}
                  className={classNames(
                    isHomePage && open
                      ? "text-slate-900 dark:text-white"
                      : isHomePage && !open
                        ? "text-white"
                        : "text-slate-900 dark:text-slate-100",
                  )}
                >
                  Documentation
                </Link>
              </li>
              <li onClick={() => setOpen(false)}>
                <Link
                  href={siteConfig.baseLinks.blog}
                  className={classNames(
                    isHomePage && open
                      ? "text-slate-900 dark:text-white"
                      : isHomePage && !open
                        ? "text-white"
                        : "text-slate-900 dark:text-slate-100",
                  )}
                >
                  Blog
                </Link>
              </li>
              <li onClick={() => setOpen(false)}>
                <Link
                  href={siteConfig.baseLinks.resources}
                  className={classNames(
                    isHomePage && open
                      ? "text-slate-900 dark:text-white"
                      : isHomePage && !open
                        ? "text-white"
                        : "text-slate-900 dark:text-slate-100",
                  )}
                >
                  Learn
                </Link>
              </li>
              <li onClick={() => setOpen(false)}>
                <Link
                  target="_blank"
                  href={documentation.CHANGELOG}
                  className={classNames(
                    isHomePage && open
                      ? "text-slate-900 dark:text-white"
                      : isHomePage && !open
                        ? "text-white"
                        : "text-slate-900 dark:text-slate-100",
                  )}
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}
