"use client"

import { blog } from "@/lib/links"
import type { Metadata } from "next"
import Content from "../../../components/markdown/iceberg_lakehouse.mdx"

const meta = blog.find((post) => post.href == "iceberg_lakehouse")
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
