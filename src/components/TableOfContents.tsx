"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
}

function toHeadingSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const content = document.querySelector("article");

    if (!content) {
      setHeadings([]);
      return;
    }

    const scanHeadings = () => {
      // Clean up previous observer
      if (observer) {
        observer.disconnect();
      }

      const headingElements = Array.from(
        content.querySelectorAll<HTMLHeadingElement>("h1, h2"),
      );
      const usedIds = new Set<string>();
      const headingItems: TOCItem[] = headingElements.map((heading, index) => {
        const text = heading.textContent?.replace("#", "").trim() || "";
        const baseId = heading.id || toHeadingSlug(text) || `section-${index + 1}`;

        let uniqueId = baseId;
        let suffix = 2;
        while (usedIds.has(uniqueId)) {
          uniqueId = `${baseId}-${suffix}`;
          suffix += 1;
        }

        if (heading.id !== uniqueId) {
          heading.id = uniqueId;
        }
        usedIds.add(uniqueId);

        return {
          id: uniqueId,
          text,
        };
      });

      const validHeadings = headingItems.filter((h) => h.id && h.text);
      setHeadings(validHeadings);

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        {
          rootMargin: "-20% 0% -35% 0%",
        },
      );

      headingElements.forEach((heading) => {
        observer!.observe(heading);
      });
    };

    // Use MutationObserver to detect when content is loaded
    const mutationObserver = new MutationObserver(() => {
      scanHeadings();
    });
    mutationObserver.observe(content, { childList: true, subtree: true });

    // Initial scan
    scanHeadings();

    return () => {
      mutationObserver.disconnect();
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-4 mt-0 uppercase tracking-[0.2em] px-2">
        Contents
      </h3>
      <nav>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-5 transition-all duration-200 ${
                  activeId === heading.id
                    ? "bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
