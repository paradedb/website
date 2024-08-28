"use client"

import { blog } from "@/lib/links"
import type { Metadata } from "next"
import Content from "../../../components/markdown/rebrand.mdx"

const meta = blog.find((post) => post.href == "rebrand")
export const metadata: Metadata = {
  title: meta?.name,
  description: meta?.description,
}

export default function Blog() {
  return (
    <div className="prose w-full max-w-3xl">
      <Content />
    </div>
  )
}
