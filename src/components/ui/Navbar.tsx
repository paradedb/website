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
    <div>
      <header
        className={classNames(
                  "z-50 mx-2 md:mx-12 mt-4 flex transform-gpu animate-slide-down-fade justify-center overflow-hidden rounded-xl border border-transparent px-4 sm:px-6 py-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform md:mt-4 md:px-0",
          open === true ? "h-52" : "h-16",
          open === true
                    ? "backdrop-blur-nav max-w-3xl border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl shadow-black/5"
            : "bg-white/0",
        )}
      >
        <div className="w-full md:my-auto">
          <div className="relative flex items-center justify-between">
            <Link href={siteConfig.baseLinks.home} aria-label="Home">
              <span className="sr-only">Company logo</span>
                      <DatabaseLogo className="w-28 sm:w-32 dark:brightness-0 dark:invert" />
            </Link>
            <nav className="hidden md:absolute md:left-1/2 md:top-1/2 md:block md:-translate-x-1/2 md:-translate-y-1/2 md:transform">
              <div className="flex items-center gap-6 text-sm font-medium">
                <Link
                  className={classNames(
                            "px-2 py-1 hover:text-indigo-600 dark:hover:text-white",
                    pathname.startsWith(siteConfig.baseLinks.blog)
                              ? "text-indigo-600 dark:text-white"
                              : "text-indigo-900 dark:text-slate-300",
                  )}
                  href={siteConfig.baseLinks.blog}
                >
                  Blog
                </Link>
                <Link
                  target="_blank"
                          className="px-2 py-1 text-indigo-900 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white"
                  href={documentation.BASE}
                >
                  Documentation
                </Link>
                <Link
                  className={classNames(
                            "px-2 py-1 hover:text-indigo-600 dark:hover:text-white",
                    pathname.startsWith(siteConfig.baseLinks.resources)
                              ? "text-indigo-600 dark:text-white"
                              : "text-indigo-900 dark:text-slate-300",
                  )}
                  href={siteConfig.baseLinks.resources}
                >
                  Learn
                </Link>
                <Link
                  target="_blank"
                          className="px-2 py-1 text-indigo-900 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white"
                  href={social.SLACK}
                >
                  Community
                </Link>
              </div>
            </nav>
            <div className="flex items-center gap-3 sm:gap-6 md:mr-1">
              <div className="hidden md:flex">
                <ThemeToggle />
              </div>
              <Link
                href={github.REPO}
                target="_blank"
                className={classNames(
                  "flex items-center justify-center space-x-2 transition-opacity duration-300",
                  stars ? "opacity-100" : "opacity-0",
                )}
              >
                <RiGithubFill
                  aria-hidden="true"
                  className="size-6 shrink-0 text-slate-900 dark:text-slate-100"
                />
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {formatStarCount(stars ?? 0)}
                </div>
              </Link>
              <Button className="hidden border-indigo-200 dark:border-indigo-600 px-4 md:flex rounded-none ring-2 ring-indigo-400 dark:ring-indigo-600/50 border-1 bg-indigo-600 dark:bg-indigo-600">
                <Link target="_blank" href={social.CALENDLY}>
                  Book a Demo
                </Link>
              </Button>
              <div className="md:hidden">
                <Button
                  onClick={() => setOpen(!open)}
                  variant="light"
                  className="aspect-square bg-opacity-0 p-2 text-slate-900 dark:text-slate-100"
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
                <Link target="_blank" href={documentation.BASE} className="text-slate-900 dark:text-slate-100">
                  Documentation
                </Link>
              </li>
              <li onClick={() => setOpen(false)}>
                <Link href={siteConfig.baseLinks.blog} className="text-slate-900 dark:text-slate-100">Blog</Link>
              </li>
              <li onClick={() => setOpen(false)}>
                <Link href={siteConfig.baseLinks.resources} className="text-slate-900 dark:text-slate-100">Learn</Link>
              </li>
              <li onClick={() => setOpen(false)}>
                <Link target="_blank" href={documentation.CHANGELOG} className="text-slate-900 dark:text-slate-100">
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
