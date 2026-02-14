"use client";

import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import copy from "copy-to-clipboard";
import { useState } from "react";

export default function CopyToClipboard({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    copy(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copyToClipboard}
      className="select-none rounded-md border border-white/10 bg-slate-900/40 dark:bg-white/20 p-1.5 transition-colors hover:bg-slate-900/60 dark:hover:bg-white/30 shadow-sm"
    >
      {!copied ? (
        <RiFileCopyLine aria-hidden="true" className="size-4 text-white" />
      ) : (
        <RiCheckLine aria-hidden="true" className="size-4 text-emerald-400" />
      )}
    </button>
  );
}
