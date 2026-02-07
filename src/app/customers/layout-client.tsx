"use client";

import { ContentLayoutShell } from "@/components/ContentLayoutShell";
import { useContentSidebar, SidebarSection } from "@/components/ContentSidebar";
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

  const sidebarSections: SidebarSection[] = [
    {
      name: "Case Studies",
      items: caseStudies.map((study) => ({
        key: study.href,
        href: `${siteConfig.baseLinks.blog}/${study.href}`,
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
      mobileNav={mobileNav}
      sidebar={desktopSidebar}
    >
      {children}
    </ContentLayoutShell>
  );
}
