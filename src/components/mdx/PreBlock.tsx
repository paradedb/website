"use client";

import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import copy from "copy-to-clipboard";
import { useRef, useState } from "react";

export default function PreBlock(props: React.ComponentProps<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = preRef.current?.textContent ?? "";
    copy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <pre ref={preRef} {...props}>
      {props.children}
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 select-none cursor-pointer rounded-md border border-white/20 bg-transparent p-1.5 shadow-sm transition-colors hover:text-white/90"
      >
        {!copied ? (
          <RiFileCopyLine aria-hidden="true" className="size-4 text-white" />
        ) : (
          <RiCheckLine aria-hidden="true" className="size-4 text-emerald-400" />
        )}
      </button>
    </pre>
  );
}
