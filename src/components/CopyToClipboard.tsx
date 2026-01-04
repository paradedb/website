"use client";

import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import React from "react";

export default function CopyToClipboard({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (error) {
      console.error("Error copying to clipboard", error);
    } finally {
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className="select-none rounded border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/20 p-1.5 transition-colors hover:bg-white dark:hover:bg-white/30"
    >
      {!copied ? (
        <RiFileCopyLine aria-hidden="true" className="size-4 text-slate-600 dark:text-slate-100" />
      ) : (
        <RiCheckLine aria-hidden="true" className="size-4 text-emerald-600 dark:text-emerald-400" />
      )}
    </button>
  );
}
