"use client";

import { ContentLayoutShell } from "@/components/ContentLayoutShell";
import { useContentSidebar, SidebarSection } from "@/components/ContentSidebar";
import { PrevNextBar } from "@/components/PrevNextBar";
import { usePathname } from "next/navigation";
import { VS_COMPETITORS } from "@/components/vs/competitors";

const VS_BASE = "/vs";

export default function VsLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isIndex = pathname === VS_BASE;

  const currentPageIdx = VS_COMPETITORS.findIndex((c) =>
    pathname.endsWith(`/${c.slug}`),
  );
  const canGoBackward = !isIndex && currentPageIdx > 0;
  const canGoForward =
    !isIndex && currentPageIdx < VS_COMPETITORS.length - 1;
  const nextHref = canGoForward
    ? `${VS_BASE}/${VS_COMPETITORS[currentPageIdx + 1].slug}`
    : undefined;
  const previousHref = canGoBackward
    ? `${VS_BASE}/${VS_COMPETITORS[currentPageIdx - 1].slug}`
    : undefined;

  const sidebarSections: SidebarSection[] = [
    {
      name: "Comparisons",
      items: VS_COMPETITORS.map((c) => ({
        key: c.slug,
        href: `${VS_BASE}/${c.slug}`,
        label: `ParadeDB vs ${c.name}`,
      })),
    },
  ];

  const { mobileNav, desktopSidebar } = useContentSidebar({
    title: "Comparisons",
    mobileBrowseLabel: "Browse Comparisons",
    sections: sidebarSections,
    collapsible: false,
    pathname,
  });

  return (
    <ContentLayoutShell
      isIndex={isIndex}
      topBar={
        !isIndex ? (
          <PrevNextBar
            previousHref={previousHref}
            nextHref={nextHref}
            previousLabel="Previous Comparison"
            nextLabel="Next Comparison"
            position="top"
          />
        ) : undefined
      }
      mobileNav={mobileNav}
      sidebar={desktopSidebar}
      bottomBar={
        !isIndex ? (
          <PrevNextBar
            previousHref={previousHref}
            nextHref={nextHref}
            previousLabel="Previous Comparison"
            nextLabel="Next Comparison"
            position="bottom"
          />
        ) : undefined
      }
    >
      {children}
    </ContentLayoutShell>
  );
}
