"use client";

import { cx } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export interface SidebarItem {
  key: string;
  href: string;
  label: React.ReactNode;
}

export interface SidebarSection {
  name: string;
  items: SidebarItem[];
}

const ChevronIcon = ({ rotated }: { rotated: boolean }) => (
  <svg
    className={cx(
      "h-4 w-4 transform transition-transform text-slate-400",
      rotated ? "rotate-90" : "rotate-0",
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
);

function SidebarLink({
  href,
  isActive,
  label,
  onClick,
}: {
  href: string;
  isActive: boolean;
  label: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={cx(
          isActive
            ? "bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400",
          "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-5 transition-all duration-200",
        )}
      >
        {label}
      </Link>
    </li>
  );
}

function CollapsibleSection({
  section,
  isCollapsed,
  onToggle,
  pathname,
  onLinkClick,
}: {
  section: SidebarSection;
  isCollapsed: boolean;
  onToggle: () => void;
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <li>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
      >
        <span>{section.name}</span>
        <ChevronIcon rotated={!isCollapsed} />
      </button>
      {!isCollapsed && (
        <ul role="list" className="mt-2 space-y-1 pl-4">
          {section.items.map((item) => (
            <SidebarLink
              key={item.key}
              href={item.href}
              isActive={pathname.endsWith(item.key)}
              label={item.label}
              onClick={onLinkClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function useContentSidebar({
  title,
  mobileBrowseLabel,
  sections,
  collapsible = true,
  pathname,
}: {
  title: string;
  mobileBrowseLabel: string;
  sections: SidebarSection[];
  collapsible?: boolean;
  pathname: string;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  const mobileNav = (
    <div className="lg:hidden px-4 md:px-12 w-full relative z-30">
      <div className="border-b border-slate-100 dark:border-slate-900">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="flex w-full items-center justify-between px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
        >
          <span>{mobileBrowseLabel}</span>
          <ChevronIcon rotated={mobileNavOpen} />
        </button>
        {mobileNavOpen && (
          <div className="px-4 pb-4">
            {collapsible ? (
              <ul role="list" className="space-y-4">
                {sections.map((section) => (
                  <CollapsibleSection
                    key={section.name}
                    section={section}
                    isCollapsed={collapsedSections.has(section.name)}
                    onToggle={() => toggleSection(section.name)}
                    pathname={pathname}
                    onLinkClick={() => setMobileNavOpen(false)}
                  />
                ))}
              </ul>
            ) : (
              <ul role="list" className="space-y-1">
                {sections.flatMap((section) =>
                  section.items.map((item) => (
                    <SidebarLink
                      key={item.key}
                      href={item.href}
                      isActive={pathname.endsWith(item.key)}
                      label={item.label}
                      onClick={() => setMobileNavOpen(false)}
                    />
                  )),
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const desktopSidebar = (
    <div className="hidden lg:flex lg:w-80 lg:shrink-0 lg:flex-col transition-colors border-r border-slate-100 dark:border-slate-900">
      <div className="sticky top-0 max-h-screen overflow-y-auto flex flex-col gap-y-5 px-6 pt-8 pb-10">
        <nav className="flex flex-1 flex-col text-slate-900 dark:text-white">
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-4 mt-0 px-2">
            {title}
          </div>
          {collapsible ? (
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              {sections.map((section) => (
                <CollapsibleSection
                  key={section.name}
                  section={section}
                  isCollapsed={collapsedSections.has(section.name)}
                  onToggle={() => toggleSection(section.name)}
                  pathname={pathname}
                />
              ))}
            </ul>
          ) : (
            <ul role="list" className="flex flex-1 flex-col space-y-1">
              {sections.flatMap((section) =>
                section.items.map((item) => (
                  <SidebarLink
                    key={item.key}
                    href={item.href}
                    isActive={pathname.endsWith(item.key)}
                    label={item.label}
                  />
                )),
              )}
            </ul>
          )}
        </nav>
      </div>
    </div>
  );

  return { mobileNav, desktopSidebar };
}
