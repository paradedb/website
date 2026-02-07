"use client";

import { ContentLayoutShell } from "@/components/ContentLayoutShell";
import { useContentSidebar, SidebarSection } from "@/components/ContentSidebar";
import { PrevNextBar } from "@/components/PrevNextBar";
import { BlogLink } from "@/lib/blog";
import { usePathname } from "next/navigation";
import { siteConfig } from "../siteConfig";

export default function CustomersLayoutClient({
  children,
  caseStudies,
}: {
  children: React.ReactNode;
  caseStudies: BlogLink[];
}) {
  const pathname = usePathname();
  const isCustomersIndex = pathname === siteConfig.baseLinks.customers;

  const currentPageIdx = caseStudies.findIndex((item) =>
    pathname.endsWith(item.href),
  );
  const canGoBackward = !isCustomersIndex && currentPageIdx > 0;
  const canGoForward =
    !isCustomersIndex && currentPageIdx < caseStudies.length - 1;
  const nextHref = canGoForward
    ? `${siteConfig.baseLinks.customers}/${caseStudies[currentPageIdx + 1].href}`
    : undefined;
  const previousHref = canGoBackward
    ? `${siteConfig.baseLinks.customers}/${caseStudies[currentPageIdx - 1].href}`
    : undefined;

  const sidebarSections: SidebarSection[] = [
    {
      name: "Case Studies",
      items: caseStudies.map((study) => ({
        key: study.href,
        href: `${siteConfig.baseLinks.customers}/${study.href}`,
        label: study.name,
      })),
    },
  ];

  const { mobileNav, desktopSidebar } = useContentSidebar({
    title: "Case Studies",
    mobileBrowseLabel: "Browse Case Studies",
    sections: sidebarSections,
    collapsible: false,
    pathname,
  });

  return (
    <ContentLayoutShell
      isIndex={isCustomersIndex}
      topBar={
        !isCustomersIndex ? (
          <PrevNextBar
            previousHref={previousHref}
            nextHref={nextHref}
            previousLabel="Previous Case Study"
            nextLabel="Next Case Study"
            position="top"
          />
        ) : undefined
      }
      mobileNav={mobileNav}
      sidebar={desktopSidebar}
      bottomBar={
        !isCustomersIndex ? (
          <PrevNextBar
            previousHref={previousHref}
            nextHref={nextHref}
            previousLabel="Previous Case Study"
            nextLabel="Next Case Study"
            position="bottom"
          />
        ) : undefined
      }
    >
      {children}
    </ContentLayoutShell>
  );
}
