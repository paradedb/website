"use client";

import { ContentLayoutShell } from "@/components/ContentLayoutShell";
import { useContentSidebar, SidebarSection } from "@/components/ContentSidebar";
import { PrevNextBar } from "@/components/PrevNextBar";
import { ResourceSection } from "@/lib/resources";
import { usePathname } from "next/navigation";
import { siteConfig } from "../siteConfig";

export default function ResourcesLayoutClient({
  children,
  resourceSections,
}: {
  children: React.ReactNode;
  resourceSections: ResourceSection[];
}) {
  const pathname = usePathname();
  const isLearnIndex = pathname === siteConfig.baseLinks.resources;

  const allResources = resourceSections.flatMap((section) => section.resources);
  const currentResourceIdx = allResources.findIndex((item) =>
    pathname.endsWith(item.href),
  );
  const canGoBackward = !isLearnIndex && currentResourceIdx > 0;
  const canGoForward =
    !isLearnIndex && currentResourceIdx < allResources.length - 1;
  const nextHref = canGoForward
    ? `${siteConfig.baseLinks.resources}/${allResources[currentResourceIdx + 1].href}`
    : undefined;
  const previousHref = canGoBackward
    ? `${siteConfig.baseLinks.resources}/${allResources[currentResourceIdx - 1].href}`
    : undefined;

  const sidebarSections: SidebarSection[] = resourceSections.map((section) => ({
    name: section.name,
    items: section.resources.map((resource) => ({
      key: resource.href,
      href: `${siteConfig.baseLinks.resources}/${resource.href}`,
      label: (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{resource.name}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold mt-0.5">
            {resource.type}
          </span>
        </div>
      ),
    })),
  }));

  const { mobileNav, desktopSidebar } = useContentSidebar({
    title: "Learning Resources",
    mobileBrowseLabel: "Browse Resources",
    sections: sidebarSections,
    pathname,
  });

  return (
    <ContentLayoutShell
      isIndex={isLearnIndex}
      topBar={
        !isLearnIndex ? (
          <PrevNextBar
            previousHref={previousHref}
            nextHref={nextHref}
            position="top"
          />
        ) : undefined
      }
      mobileNav={mobileNav}
      sidebar={desktopSidebar}
      bottomBar={
        !isLearnIndex ? (
          <PrevNextBar
            previousHref={previousHref}
            nextHref={nextHref}
            position="bottom"
          />
        ) : undefined
      }
    >
      {children}
    </ContentLayoutShell>
  );
}
