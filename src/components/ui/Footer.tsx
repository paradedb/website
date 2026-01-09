"use client";

import { siteConfig } from "@/app/siteConfig";
import {
  company,
  documentation,
  email,
  github,
  legal,
  social,
} from "@/lib/links";
import { RiArrowRightUpLine, RiMailLine } from "@remixicon/react";
import Link from "next/link";
import { DatabaseLogo } from "./DatabaseLogo";
import { Button } from "../Button";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";
import classNames from "classnames";

const navigation = {
  // ... (rest of navigation object remains the same)
  company: [
    { name: "Blog", href: siteConfig.baseLinks.blog, external: false },
    { name: "Learn", href: siteConfig.baseLinks.resources, external: false },
    { name: "Documentation", href: documentation.BASE, external: true },
    { name: "Changelog", href: documentation.CHANGELOG, external: true },
  ],
  connect: [
    { name: "Slack Community", href: social.SLACK, external: true },
    { name: "GitHub", href: github.REPO, external: true },
    { name: "Twitter", href: social.TWITTER, external: true },
    { name: "LinkedIn", href: social.LINKEDIN, external: true },
    { name: "RSS Feed", href: `${siteConfig.url}/feed.xml`, external: false },
  ],
  resources: [
    { name: "Careers", href: company.CAREERS, external: true },
    { name: "Contact", href: social.CALENDLY, external: true },
    { name: "Sales", href: social.CALENDLY, external: true },
    { name: "Support", href: email.SUPPORT, external: false },
  ],
  legal: [
    { name: "Privacy", href: legal.PRIVACY, external: true },
    { name: "Terms", href: legal.TERMS, external: true },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div
      className={classNames(
        "w-full relative opacity-0 animate-fade-in delay-2200",
        isHomePage ? "bg-indigo-600" : "bg-white dark:bg-slate-950",
      )}
    >
      <footer
        id="footer"
        className={classNames(
          "relative w-full overflow-hidden max-w-[1440px] mx-auto",
          isHomePage
            ? "bg-indigo-600 text-white"
            : "bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100",
        )}
      >
        <div
          className={classNames(
            "absolute inset-y-0 left-4 md:left-12 w-px z-30 pointer-events-none",
            isHomePage ? "bg-white/20" : "bg-slate-200 dark:bg-slate-900",
          )}
        />
        <div
          className={classNames(
            "absolute inset-y-0 right-4 md:right-12 w-px z-30 pointer-events-none",
            isHomePage ? "bg-white/20" : "bg-slate-200 dark:bg-slate-900",
          )}
        />

        {/* Horizontal Line constrained to vertical lines */}
        <div
          className={classNames(
            "absolute top-0 left-4 md:left-12 right-4 md:right-12 h-px z-30",
            isHomePage ? "bg-white/20" : "bg-slate-200 dark:bg-slate-900",
          )}
        />

        <div className="px-4 md:px-12 w-full flex flex-col relative pb-0">
          <div className="relative w-full pt-16 md:pt-24 pb-0 px-6 md:px-12">
            <div className="xl:grid xl:grid-cols-3 xl:gap-20">
              <div className="space-y-8">
                <Link href={siteConfig.baseLinks.home}>
                  <DatabaseLogo
                    className={classNames(
                      "w-32 transition-colors",
                      isHomePage
                        ? "brightness-0 invert"
                        : "dark:brightness-0 dark:invert",
                    )}
                  />
                </Link>
                <p
                  className={classNames(
                    "mt-4 md:mt-8 text-sm leading-6 max-w-xs",
                    isHomePage
                      ? "text-indigo-50"
                      : "text-gray-600 dark:text-slate-400",
                  )}
                >
                  Simple, Elastic-Quality Search for Postgres.
                </p>
                <div className="md:pt-4">
                  <Button
                    asChild
                    className={classNames(
                      "h-10 rounded-none shadow-none font-semibold",
                      isHomePage
                        ? "bg-white text-indigo-600 ring-2 ring-white/50 border-1 border-white hover:bg-indigo-50"
                        : "bg-indigo-600 ring-2 ring-indigo-400 dark:ring-indigo-600/50 border-1 border-indigo-400 dark:border-indigo-600 text-white",
                    )}
                  >
                    <Link href={email.HELLO}>
                      <RiMailLine className="mr-2 size-4" />
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mt-16 grid grid-cols-1 gap-14 sm:gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3
                      className={classNames(
                        "text-sm font-semibold leading-6",
                        isHomePage
                          ? "text-white"
                          : "text-gray-900 dark:text-slate-100",
                      )}
                    >
                      Company
                    </h3>
                    <ul role="list" className="mt-6 space-y-4">
                      {navigation.company.map((item) => (
                        <li key={item.name} className="w-fit">
                          <Link
                            className={classNames(
                              "flex rounded-md text-sm transition",
                              isHomePage
                                ? "text-indigo-100 hover:text-white"
                                : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100",
                            )}
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={
                              item.external ? "noopener noreferrer" : undefined
                            }
                          >
                            <span>{item.name}</span>
                            {item.external && (
                              <div
                                className={classNames(
                                  "ml-1 aspect-square size-3 rounded-full p-px",
                                  isHomePage
                                    ? "bg-white/10"
                                    : "bg-gray-100 dark:bg-slate-800",
                                )}
                              >
                                <RiArrowRightUpLine
                                  aria-hidden="true"
                                  className={classNames(
                                    "size-full shrink-0",
                                    isHomePage
                                      ? "text-white"
                                      : "text-gray-900 dark:text-slate-100",
                                  )}
                                />
                              </div>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3
                      className={classNames(
                        "text-sm font-semibold leading-6",
                        isHomePage
                          ? "text-white"
                          : "text-gray-900 dark:text-slate-100",
                      )}
                    >
                      Connect
                    </h3>
                    <ul role="list" className="mt-6 space-y-4">
                      {navigation.connect.map((item) => (
                        <li key={item.name} className="w-fit">
                          <Link
                            className={classNames(
                              "flex rounded-md text-sm transition",
                              isHomePage
                                ? "text-indigo-100 hover:text-white"
                                : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100",
                            )}
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={
                              item.external ? "noopener noreferrer" : undefined
                            }
                          >
                            <span>{item.name}</span>
                            {item.external && (
                              <div
                                className={classNames(
                                  "ml-0.5 aspect-square size-3 rounded-full p-px",
                                  isHomePage
                                    ? "bg-white/10"
                                    : "bg-gray-100 dark:bg-slate-800",
                                )}
                              >
                                <RiArrowRightUpLine
                                  aria-hidden="true"
                                  className={classNames(
                                    "size-full shrink-0",
                                    isHomePage
                                      ? "text-white"
                                      : "text-gray-900 dark:text-slate-100",
                                  )}
                                />
                              </div>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3
                      className={classNames(
                        "text-sm font-semibold leading-6",
                        isHomePage
                          ? "text-white"
                          : "text-gray-900 dark:text-slate-100",
                      )}
                    >
                      Resources
                    </h3>
                    <ul role="list" className="mt-6 space-y-4">
                      {navigation.resources.map((item) => (
                        <li key={item.name} className="w-fit">
                          <Link
                            className={classNames(
                              "flex rounded-md text-sm transition",
                              isHomePage
                                ? "text-indigo-100 hover:text-white"
                                : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100",
                            )}
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={
                              item.external ? "noopener noreferrer" : undefined
                            }
                          >
                            <span>{item.name}</span>
                            {item.external && (
                              <div
                                className={classNames(
                                  "ml-1 aspect-square size-3 rounded-full p-px",
                                  isHomePage
                                    ? "bg-white/10"
                                    : "bg-gray-100 dark:bg-slate-800",
                                )}
                              >
                                <RiArrowRightUpLine
                                  aria-hidden="true"
                                  className={classNames(
                                    "size-full shrink-0",
                                    isHomePage
                                      ? "text-white"
                                      : "text-gray-900 dark:text-slate-100",
                                  )}
                                />
                              </div>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3
                      className={classNames(
                        "text-sm font-semibold leading-6",
                        isHomePage
                          ? "text-white"
                          : "text-gray-900 dark:text-slate-100",
                      )}
                    >
                      Legal
                    </h3>
                    <ul role="list" className="mt-6 space-y-4">
                      {navigation.legal.map((item) => (
                        <li key={item.name} className="w-fit">
                          <Link
                            className={classNames(
                              "flex rounded-md text-sm transition",
                              isHomePage
                                ? "text-indigo-100 hover:text-white"
                                : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100",
                            )}
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={
                              item.external ? "noopener noreferrer" : undefined
                            }
                          >
                            <span>{item.name}</span>
                            {item.external && (
                              <div
                                className={classNames(
                                  "ml-1 aspect-square size-3 rounded-full p-px",
                                  isHomePage
                                    ? "bg-white/10"
                                    : "bg-gray-100 dark:bg-slate-800",
                                )}
                              >
                                <RiArrowRightUpLine
                                  aria-hidden="true"
                                  className={classNames(
                                    "size-full shrink-0",
                                    isHomePage
                                      ? "text-white"
                                      : "text-gray-900 dark:text-slate-100",
                                  )}
                                />
                              </div>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-16 md:mt-24">
            <div
              className={classNames(
                "absolute top-0 left-0 right-0 h-px z-30",
                isHomePage ? "bg-white/20" : "bg-slate-200 dark:bg-slate-900",
              )}
            />
            <div className="w-full px-6 md:px-12 pt-8 sm:pt-4 pb-4 flex flex-col items-center justify-between gap-6 sm:flex-row">
              <p
                className={classNames(
                  "text-sm leading-5",
                  isHomePage
                    ? "text-indigo-100"
                    : "text-gray-500 dark:text-slate-400",
                )}
              >
                &copy; {new Date().getFullYear()} ParadeDB, Inc. All rights
                reserved.
              </p>
              <ThemeToggle variant={isHomePage ? "white" : "default"} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
