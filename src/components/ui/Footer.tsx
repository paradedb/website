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
import { DatabaseLogo } from "../../../public/DatabaseLogo";
import { Button } from "../Button";
import { ThemeToggle } from "./ThemeToggle";

const navigation = {
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
    { name: "Contact", href: email.HELLO, external: false },
    { name: "Sales", href: email.SALES, external: false },
    { name: "Support", href: email.SUPPORT, external: false },
  ],
  legal: [
    { name: "Privacy", href: legal.PRIVACY, external: true },
    { name: "Terms", href: legal.TERMS, external: true },
  ],
};

export default function Footer() {
  return (
    <footer id="footer" className="relative w-full overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Outer Vertical Layout Borders */}
      <div className="absolute inset-y-0 left-2 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
      <div className="absolute inset-y-0 right-2 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

      {/* Inner Vertical Borders for boxed look */}
      <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200/50 dark:bg-slate-900/50 z-30 pointer-events-none hidden xl:block" />
      <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200/50 dark:bg-slate-900/50 z-30 pointer-events-none hidden xl:block" />

      <div className="px-2 md:px-12 w-full flex flex-col relative pb-4">
        <div className="relative max-w-[1128px] mx-auto w-full pt-16 md:pt-24 pb-0 px-6 md:px-12">
          <div className="xl:grid xl:grid-cols-3 xl:gap-20">
            <div className="space-y-8">
              <Link href={siteConfig.baseLinks.home}>
                <DatabaseLogo className="w-32 dark:brightness-0 dark:invert" />
              </Link>
              <p className="mt-8 text-sm leading-6 text-gray-600 dark:text-slate-400 max-w-xs">
                Simple, Elastic-Quality Search for Postgres.
              </p>
              <div className="pt-4">
                <Button asChild className="h-10 rounded-none bg-indigo-600 ring-2 ring-indigo-400 dark:ring-indigo-600/50 border-1 border-indigo-400 dark:border-indigo-600 text-white font-semibold shadow-none">
                  <Link href={email.SALES}>
                    <RiMailLine className="mr-2 size-4" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-14 sm:gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-100">
                    Company
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.company.map((item) => (
                      <li key={item.name} className="w-fit">
                        <Link
                          className="flex rounded-md text-sm text-gray-500 dark:text-slate-400 transition hover:text-gray-900 dark:hover:text-slate-100"
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                        >
                          <span>{item.name}</span>
                          {item.external && (
                            <div className="ml-1 aspect-square size-3 rounded-full bg-gray-100 dark:bg-slate-800 p-px">
                              <RiArrowRightUpLine
                                aria-hidden="true"
                                className="size-full shrink-0 text-gray-900 dark:text-slate-100"
                              />
                            </div>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-100">
                    Connect
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.connect.map((item) => (
                      <li key={item.name} className="w-fit">
                        <Link
                          className="flex rounded-md text-sm text-gray-500 dark:text-slate-400 transition hover:text-gray-900 dark:hover:text-slate-100"
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                        >
                          <span>{item.name}</span>
                          {item.external && (
                            <div className="ml-0.5 aspect-square size-3 rounded-full bg-gray-100 dark:bg-slate-800 p-px">
                              <RiArrowRightUpLine
                                aria-hidden="true"
                                className="size-full shrink-0 text-gray-900 dark:text-slate-100"
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
                  <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-100">
                    Resources
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.resources.map((item) => (
                      <li key={item.name} className="w-fit">
                        <Link
                          className="flex rounded-md text-sm text-gray-500 dark:text-slate-400 transition hover:text-gray-900 dark:hover:text-slate-100"
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                        >
                          <span>{item.name}</span>
                          {item.external && (
                            <div className="ml-1 aspect-square size-3 rounded-full bg-gray-100 dark:bg-slate-800 p-px">
                              <RiArrowRightUpLine
                                aria-hidden="true"
                                className="size-full shrink-0 text-gray-900 dark:text-slate-100"
                              />
                            </div>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-100">
                    Legal
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.legal.map((item) => (
                      <li key={item.name} className="w-fit">
                        <Link
                          className="flex rounded-md text-sm text-gray-500 dark:text-slate-400 transition hover:text-gray-900 dark:hover:text-slate-100"
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                        >
                          <span>{item.name}</span>
                          {item.external && (
                            <div className="ml-1 aspect-square size-3 rounded-full bg-gray-100 dark:bg-slate-800 p-px">
                              <RiArrowRightUpLine
                                aria-hidden="true"
                                className="size-full shrink-0 text-gray-900 dark:text-slate-100"
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

        <div className="border-t border-slate-200 dark:border-slate-900 mt-16 md:mt-24">
          <div className="max-w-[1128px] mx-auto px-6 md:px-12 pt-4 pb-0 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <p className="text-sm leading-5 text-gray-500 dark:text-slate-400">
                &copy; {new Date().getFullYear()} ParadeDB, Inc. All rights
                reserved.
              </p>
            </div>
            <div className="rounded-full border border-gray-200 dark:border-slate-900 py-1 pl-1 pr-2">
              <div className="flex items-center gap-1.5">
                <div className="relative size-4 shrink-0">
                  <div className="absolute inset-[1px] rounded-full bg-emerald-500/20" />
                  <div className="absolute inset-1 rounded-full bg-emerald-600" />
                </div>
                <span className="text-xs text-gray-700 dark:text-slate-300">
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
