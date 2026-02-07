"use client";

import { useState } from "react";
import {
  RiFileCopyLine,
  RiCheckLine,
  RiOpenaiFill,
  RiClaudeFill,
  RiPerplexityFill,
  RiGithubFill,
} from "@remixicon/react";

interface ArticleActionsProps {
  basePath: string;
  slug: string;
}

export default function ArticleActions({
  basePath,
  slug,
}: ArticleActionsProps) {
  const [copied, setCopied] = useState(false);

  const rawUrl = `https://raw.githubusercontent.com/paradedb/website/main/src/app/${basePath}/${slug}/index.mdx`;
  const editUrl = `https://github.com/paradedb/website/edit/main/src/app/${basePath}/${slug}/index.mdx`;
  const prompt = encodeURIComponent(
    `Read from ${rawUrl} so I can ask questions about it.`,
  );

  const handleCopyMarkdown = async () => {
    try {
      const res = await fetch(rawUrl);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail if fetch or clipboard fails
    }
  };

  const linkClass =
    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200";

  return (
    <div className="w-full">
      <ul className="space-y-0.5">
        <li>
          <button
            onClick={handleCopyMarkdown}
            className={`${linkClass} w-full`}
          >
            {copied ? (
              <RiCheckLine size={16} className="shrink-0 text-green-600" />
            ) : (
              <RiFileCopyLine size={16} className="shrink-0" />
            )}
            {copied ? "Copied!" : "Copy markdown"}
          </button>
        </li>
        <li>
          <a
            href={`https://chatgpt.com/?hints=search&q=${prompt}`}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <RiOpenaiFill size={16} className="shrink-0" />
            Open in ChatGPT
          </a>
        </li>
        <li>
          <a
            href={`https://claude.ai/new?q=${prompt}`}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <RiClaudeFill size={16} className="shrink-0" />
            Open in Claude
          </a>
        </li>
        <li>
          <a
            href={`https://www.perplexity.ai/?q=${prompt}`}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <RiPerplexityFill size={16} className="shrink-0" />
            Open in Perplexity
          </a>
        </li>
        <li>
          <a
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <RiGithubFill size={16} className="shrink-0" />
            Edit on GitHub
          </a>
        </li>
      </ul>
    </div>
  );
}
