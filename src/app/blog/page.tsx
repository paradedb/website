import { blog } from "@/lib/links";
import { redirect } from "next/navigation";
import { siteConfig } from "../siteConfig";

export default function Blog() {
  redirect(`${siteConfig.baseLinks.blog}/${blog[0].href}`);
}
