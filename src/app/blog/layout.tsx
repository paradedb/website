import type { Metadata } from "next";
import { getBlogLinks } from "@/lib/blog";
import BlogLayoutClient from "./layout-client";
import { siteConfig } from "../siteConfig";

export const metadata: Metadata = {
  title: "Blog", // → becomes "Blog | ParadeDB" via global template
  description:
    "Engineering deep dives, product and company announcements, and guides from the ParadeDB team.",
  openGraph: {
    title: "Blog",
    description:
      "Engineering deep dives, product and company announcements, and guides from the ParadeDB team.",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description:
      "Engineering deep dives, product and company announcements, and guides from the ParadeDB team.",
    creator: "@paradedb",
  },
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
};

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const blogLinks = await getBlogLinks();

  return <BlogLayoutClient blogLinks={blogLinks}>{children}</BlogLayoutClient>;
}
