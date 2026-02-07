"use client";

import { ContentLayoutShell } from "@/components/ContentLayoutShell";
import { useContentSidebar, SidebarSection } from "@/components/ContentSidebar";
import { PrevNextBar } from "@/components/PrevNextBar";
import { BlogSection } from "@/lib/blog";
import { usePathname } from "next/navigation";
import { siteConfig } from "../siteConfig";

export default function BlogLayoutClient({
  children,
  blogSections,
}: {
  children: React.ReactNode;
  blogSections: BlogSection[];
}) {
  const pathname = usePathname();
  const isBlogIndex = pathname === siteConfig.baseLinks.blog;

  const allLinks = blogSections.flatMap((section) => section.links);
  const currentPageIdx = allLinks.findIndex((item) =>
    pathname.endsWith(item.href),
  );
  const canGoBackward = !isBlogIndex && currentPageIdx > 0;
  const canGoForward = !isBlogIndex && currentPageIdx < allLinks.length - 1;
  const nextHref = canGoForward
    ? `${siteConfig.baseLinks.blog}/${allLinks[currentPageIdx + 1].href}`
    : undefined;
  const previousHref = canGoBackward
    ? `${siteConfig.baseLinks.blog}/${allLinks[currentPageIdx - 1].href}`
    : undefined;

  const sidebarSections: SidebarSection[] = blogSections.map((section) => ({
    name: section.name,
    items: section.links.map((link) => ({
      key: link.href,
      href: `${siteConfig.baseLinks.blog}/${link.href}`,
      label: link.name,
    })),
  }));

  const { mobileNav, desktopSidebar } = useContentSidebar({
    title: "Blog Posts",
    mobileBrowseLabel: "Browse Posts",
    sections: sidebarSections,
    pathname,
  });

  return (
    <ContentLayoutShell
      isIndex={isBlogIndex}
      topBar={
        !isBlogIndex ? (
          <PrevNextBar
            previousHref={previousHref}
            nextHref={nextHref}
            previousLabel="Previous Post"
            nextLabel="Next Post"
            position="top"
          />
        ) : undefined
      }
      mobileNav={mobileNav}
      sidebar={desktopSidebar}
      bottomBar={
        !isBlogIndex ? (
          <PrevNextBar
            previousHref={previousHref}
            nextHref={nextHref}
            previousLabel="Previous Post"
            nextLabel="Next Post"
            position="bottom"
          />
        ) : undefined
      }
    >
      {children}
    </ContentLayoutShell>
  );
}
