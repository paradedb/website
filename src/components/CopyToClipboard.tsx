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
      className="select-none cursor-pointer rounded-md border border-white/20 bg-transparent p-1.5 transition-colors hover:text-white/90 shadow-sm"
    >
      {!copied ? (
        <RiFileCopyLine aria-hidden="true" className="size-4 text-white" />
      ) : (
        <RiCheckLine aria-hidden="true" className="size-4 text-emerald-400" />
      )}
    </button>
  );
}
