"use client";

import React from "react";

export function CopyButton({ code }: { code: string }) {
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
      className="text-xs text-white font-mono font-medium hover:text-white/80 transition-colors"
    >
      [{copied ? "copied" : "copy"}]
    </button>
  );
}
