import { siteConfig } from "@/app/siteConfig"
import { blog } from "@/lib/links"
import type { Metadata } from "next"

const meta = blog.find((post) => post.href == "introducing_paradedb")
export const metadata: Metadata = {
  title: meta?.name ?? siteConfig.name,
  description: meta?.description ?? siteConfig.description,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
