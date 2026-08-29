"use client";

import { RiCheckLine } from "@remixicon/react";
import copy from "copy-to-clipboard";
import { useState } from "react";
import { cx } from "@/lib/utils";

export default function CopyableCommand({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    copy(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copyToClipboard}
      aria-label="Copy command to clipboard"
      className={cx(
        "group relative inline-flex items-center cursor-pointer select-none font-mono",
        className,
      )}
    >
      <span className="underline underline-offset-4 decoration-white/40">
        {code}
      </span>
      <span
        role="status"
        className={cx(
          "pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 font-sans text-xs text-white dark:bg-white dark:text-slate-900 transition-opacity",
          copied ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      >
        {copied ? (
          <span className="inline-flex items-center gap-1">
            <RiCheckLine className="size-3.5 text-emerald-400 dark:text-emerald-600" />
            Copied
          </span>
        ) : (
          "Click to copy"
        )}
      </span>
    </button>
  );
}
