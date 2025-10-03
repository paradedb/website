"use client";

import { siteConfig } from "@/app/siteConfig";
import { documentation, github, social } from "@/lib/links";
import { RiCloseLine, RiGithubFill, RiMenuLine } from "@remixicon/react";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { DatabaseLogo } from "../../../public/DatabaseLogo";
import { Button } from "../Button";

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
      <div className="flex w-screen justify-center space-x-4 bg-indigo-600 px-2 py-4 text-center text-white">
        <div className="hidden rounded bg-white bg-opacity-20 px-2 py-1 text-xs font-medium md:block">
          News
        </div>
        <div className="relative top-0.5 text-left text-sm">
          Announcing our{" "}
          <Link
            href={`${siteConfig.baseLinks.blog}/series_a_announcement`}
            className="font-semibold underline"
          >
            $12M Series A
          </Link>{" "}
          led by Craft Ventures 🎉. Read it on{" "}
          <Link
            href="https://techcrunch.com/2025/07/15/paradedb-takes-on-elasticsearch-as-interest-in-postgres-explodes-amid-ai-boom/"
            className="font-semibold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            TechCrunch
          </Link>
          {""}.
        </div>
      </div>
      <header
        className={classNames(
          "inset-x-3 z-50 mx-auto mt-4 flex max-w-6xl transform-gpu animate-slide-down-fade justify-center overflow-hidden rounded-xl border border-transparent px-6 py-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform md:mt-4 md:px-3",
          open === true ? "h-52" : "h-16",
          open === true
            ? "backdrop-blur-nav max-w-3xl border-gray-100 bg-white/80 shadow-xl shadow-black/5"
            : "bg-white/0",
        )}
      >
        <div className="w-full md:my-auto">
          <div className="relative flex items-center justify-between">
            <Link href={siteConfig.baseLinks.home} aria-label="Home">
              <span className="sr-only">Company logo</span>
              <DatabaseLogo className="w-32" />
            </Link>
            <nav className="hidden md:absolute md:left-1/2 md:top-1/2 md:block md:-translate-x-1/2 md:-translate-y-1/2 md:transform">
              <div className="flex items-center gap-6 text-sm font-medium">
                <Link
                  className={classNames(
                    "px-2 py-1 hover:text-indigo-600",
                    pathname.startsWith(siteConfig.baseLinks.blog)
                      ? "text-indigo-600"
                      : "text-indigo-900",
                  )}
                  href={siteConfig.baseLinks.blog}
                >
                  Blog
                </Link>
                <Link
                  className={classNames(
                    "px-2 py-1 hover:text-indigo-600",
                    pathname.startsWith(siteConfig.baseLinks.resources)
                      ? "text-indigo-600"
                      : "text-indigo-900",
                  )}
                  href={siteConfig.baseLinks.resources}
                >
                  Resources
                </Link>
                <Link
                  target="_blank"
                  className="px-2 py-1 text-indigo-900 hover:text-indigo-600"
                  href={documentation.BASE}
                >
                  Documentation
                </Link>
                <Link
                  target="_blank"
                  className="px-2 py-1 text-indigo-900 hover:text-indigo-600"
                  href={social.SLACK}
                >
                  Community
                </Link>
              </div>
            </nav>
            <div className="flex space-x-6">
              <div className="flex items-center justify-center space-x-6">
                <Link
                  href={github.REPO}
                  target="_blank"
                  className={classNames(
                    "flex items-center justify-center space-x-2",
                    stars ? "opacity-100" : "opacity-0",
                  )}
                >
                  <RiGithubFill
                    aria-hidden="true"
                    className="size-6 shrink-0 text-indigo-900"
                  />
                  <div className="text-sm font-medium text-indigo-900">
                    {formatStarCount(stars ?? 0)}
                  </div>
                </Link>
                <Button className="hidden rounded-full border-4 border-indigo-200 px-4 md:flex">
                  <Link target="_blank" href={social.CALENDLY}>
                    Book a Demo
                  </Link>
                </Button>
              </div>
              <div className="md:hidden">
                <Button
                  onClick={() => setOpen(!open)}
                  variant="light"
                  className="aspect-square bg-opacity-0 p-2"
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
                <Link target="_blank" href={documentation.BASE}>
                  Documentation
                </Link>
              </li>
              <li onClick={() => setOpen(false)}>
                <Link href={siteConfig.baseLinks.blog}>Blog</Link>
              </li>
              <li onClick={() => setOpen(false)}>
                <Link href={siteConfig.baseLinks.resources}>Resources</Link>
              </li>
              <li onClick={() => setOpen(false)}>
                <Link target="_blank" href={documentation.CHANGELOG}>
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
