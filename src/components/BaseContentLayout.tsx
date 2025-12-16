"use client";

import { Button } from "@/components/Button";
import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import { ContentLink, ContentSection } from "@/lib/content";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/app/siteConfig";
import { useState } from "react";
import CodeBlockEnhancer from "@/components/CodeBlockEnhancer";

interface BaseContentLayoutProps {
  children: React.ReactNode;
  contentType: "blog" | "learn";
  items?: ContentLink[];
  sections?: ContentSection[];
  showNavigation?: boolean;
  showCodeBlockEnhancer?: boolean;
}

const BackButton = ({ href }: { href: string }) => (
  <Link href={href}>
    <Button
      className="group bg-transparent px-0 text-gray-600 hover:bg-transparent"
      variant="light"
    >
      <ArrowAnimated
        className="relative right-3 rotate-180 transform stroke-gray-600"
        aria-hidden="true"
      />
      <div>Previous Post</div>
    </Button>
  </Link>
);

const NextButton = ({ href }: { href: string }) => (
  <Link href={href}>
    <Button
      className="group bg-transparent px-0 text-gray-600 hover:bg-transparent"
      variant="light"
    >
      Next Post
      <ArrowAnimated className="stroke-gray-600" aria-hidden="true" />
    </Button>
  </Link>
);

export default function BaseContentLayout({
  children,
  contentType,
  items = [],
  sections = [],
  showNavigation = true,
  showCodeBlockEnhancer = false,
}: BaseContentLayoutProps) {
  const pathname = usePathname();
  const baseUrl =
    contentType === "learn"
      ? siteConfig.baseLinks.resources
      : siteConfig.baseLinks.blog;
  const isIndex = pathname === baseUrl;
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  );

  const toggleSection = (sectionName: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionName)) {
      newCollapsed.delete(sectionName);
    } else {
      newCollapsed.add(sectionName);
    }
    setCollapsedSections(newCollapsed);
  };

  let currentPageIdx = -1;
  let canGoBackward = false;
  let canGoForward = false;
  let nextHref = "";
  let previousHref = "";

  if (contentType === "blog" && items.length > 0) {
    currentPageIdx = items.findIndex((item) => pathname.endsWith(item.href));
    canGoBackward = !isIndex && currentPageIdx > 0;
    canGoForward = !isIndex && currentPageIdx < items.length - 1;
    nextHref = canGoForward
      ? `${baseUrl}/${items[currentPageIdx + 1].href}`
      : "";
    previousHref = canGoBackward
      ? `${baseUrl}/${items[currentPageIdx - 1].href}`
      : "";
  }

  const currentResource =
    sections.length > 0
      ? sections
          .flatMap((section) =>
            section.items.map((item) => ({
              ...item,
              sectionName: section.name,
            })),
          )
          .find((item) => pathname.endsWith(item.href))
      : null;

  const renderSidebar = () => {
    if (contentType === "blog" && items.length > 0) {
      return (
        <div className="hidden lg:flex lg:w-96 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {items.map((item) => (
                      <li key={item.href}>
                        <a
                          href={`${baseUrl}/${item.href}`}
                          className={classNames(
                            pathname.endsWith(item.href)
                              ? "bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
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
      );
    }

    if (contentType === "learn" && sections.length > 0) {
      return (
        <div className="hidden lg:flex lg:w-96 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                {sections.map((section) => (
                  <li key={section.name}>
                    <button
                      onClick={() => toggleSection(section.name)}
                      className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      <span>{section.name}</span>
                      <svg
                        className={classNames(
                          "h-4 w-4 transform transition-transform",
                          collapsedSections.has(section.name)
                            ? "rotate-0"
                            : "rotate-90",
                        )}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {!collapsedSections.has(section.name) && (
                      <ul role="list" className="mt-2 space-y-1 pl-4">
                        {section.items.map((item) => (
                          <li key={item.href}>
                            <a
                              href={`${baseUrl}/${item.href}`}
                              className={classNames(
                                pathname.endsWith(item.href)
                                  ? "bg-gray-50 text-indigo-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6",
                              )}
                            >
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {item.name}
                                </span>
                                {item.type && (
                                  <span className="text-xs text-gray-500 capitalize">
                                    {item.type}
                                  </span>
                                )}
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mx-auto flex max-w-6xl md:mt-12">
      {!isIndex && showNavigation && renderSidebar()}

      <main className="w-full px-6 py-4 md:py-0">
        {currentResource && contentType === "learn" && (
          <nav className="lg:hidden mb-4">
            <a
              href="/learn"
              className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
            >
              <span className="mr-2">←</span>
              Learn
            </a>
          </nav>
        )}

        {contentType === "blog" && showNavigation && (
          <div className="mx-auto flex justify-between">
            <div>{canGoBackward && <BackButton href={previousHref} />}</div>
            <div>{canGoForward && <NextButton href={nextHref} />}</div>
          </div>
        )}

        <div className="w-full py-4">{children}</div>

        {contentType === "blog" && showNavigation && (
          <div className="mx-auto flex justify-between">
            <div>{canGoBackward && <BackButton href={previousHref} />}</div>
            <div>{canGoForward && <NextButton href={nextHref} />}</div>
          </div>
        )}
      </main>
      {showCodeBlockEnhancer && <CodeBlockEnhancer />}
    </div>
  );
}
