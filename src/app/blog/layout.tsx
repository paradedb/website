import { getBlogLinks } from "@/lib/blog";
import BlogLayoutClient from "./layout-client";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const blogLinks = await getBlogLinks();

  return <BlogLayoutClient blogLinks={blogLinks}>{children}</BlogLayoutClient>;
}