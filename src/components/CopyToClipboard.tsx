"use client"

import { RiCheckLine, RiFileCopyLine } from "@remixicon/react"
import React from "react"

export default function CopyToClipboard({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false)
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch (error) {
      console.error("Error copying to clipboard", error)
    } finally {
      setTimeout(() => {
        setCopied(false)
      }, 1500)
    }
  }

  return (
    <button
      onClick={copyToClipboard}
      className="select-none rounded border border-white/10 bg-white/20 p-1"
    >
      {!copied ? (
        <RiFileCopyLine aria-hidden="true" className="size-4 text-slate-100" />
      ) : (
        <RiCheckLine aria-hidden="true" className="size-4 text-slate-100" />
      )}
    </button>
  )
}
