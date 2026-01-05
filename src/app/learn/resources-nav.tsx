"use client";

import { ResourceSection } from "@/lib/resources";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "../siteConfig";
import Link from "next/link";

interface ResourcesNavProps {
  resourceSections: ResourceSection[];
}

export function ResourcesNav({ resourceSections }: ResourcesNavProps) {
  const pathname = usePathname();
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

  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        {resourceSections.map((section) => (
          <li key={section.name}>
            <button
              onClick={() => toggleSection(section.name)}
              className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-indigo-900"
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
                {section.resources.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={`${siteConfig.baseLinks.resources}/${item.href}`}
                      className={classNames(
                        pathname.endsWith(item.href)
                          ? "bg-gray-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
                          : "text-gray-700 dark:text-indigo-200 hover:bg-gray-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400",
                        "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6",
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-xs text-gray-500 dark:text-indigo-500 capitalize">
                          {item.type}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
