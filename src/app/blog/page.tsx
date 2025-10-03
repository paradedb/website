import { getBlogLinks } from "@/lib/blog";
import { redirect } from "next/navigation";
import { siteConfig } from "../siteConfig";

export default async function Blog() {
  const blogLinks = await getBlogLinks();
  redirect(`${siteConfig.baseLinks.blog}/${blogLinks[0]?.href || ""}`);
}
