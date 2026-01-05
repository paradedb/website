"use client";

import type { ThemedToken } from "shiki";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { RiFileCopyLine, RiCheckLine } from "@remixicon/react";

export function HeroDemo({
  lightTokens,
  darkTokens,
  code,
}: {
  lightTokens: ThemedToken[][];
  darkTokens: ThemedToken[][];
  code: string;
}) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const tokens = mounted && resolvedTheme === "dark" ? darkTokens : lightTokens;

  return (
    <div
      onClick={copyToClipboard}
      className="overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300 ease-out w-full relative group cursor-pointer"
    >
      {/* Hover Overlay */}
      <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-indigo-50/10 dark:bg-slate-900/20">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-slate-800/90 backdrop-blur transform scale-95 group-hover:scale-100 transition-transform duration-300">
          {copied ? (
            <>
              <RiCheckLine className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Copied!
              </span>
            </>
          ) : (
            <>
              <RiFileCopyLine className="size-4 text-slate-600 dark:text-slate-300" />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Copy to Clipboard
              </span>
            </>
          )}
        </div>
      </div>

      {/* Code Content */}
      <div className="relative w-full bg-transparent text-left py-4 md:py-6 pl-6 md:pl-8 pr-6 text-sm md:text-base font-mono leading-tight z-10 group-hover:opacity-40 transition-opacity duration-300">
        {tokens.map((lineTokens, i) => {
          const isLineEmpty =
            lineTokens.length === 0 ||
            (lineTokens.length === 1 && lineTokens[0].content.trim() === "");

          return (
            <div key={i} className="relative flex items-start min-h-0 mb-1 last:mb-0">
              <span className="text-indigo-500/50 dark:text-white/60 mr-3 select-none flex-shrink-0 w-4 text-xs md:text-sm pt-0.5">
                {!isLineEmpty ? "$" : ""}
              </span>
              <div className="whitespace-pre-wrap break-all">
                {lineTokens.map((token, j) => (
                  <span key={j} style={{ color: token.color }}>
                    {token.content}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
