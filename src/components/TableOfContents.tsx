"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Wait for content to load, then scan for headings
    const scanHeadings = () => {
      const headingElements = document.querySelectorAll("h1, h2");
      const headingItems: TOCItem[] = Array.from(headingElements).map(
        (heading) => {
          // If heading doesn't have an id, generate one from the text
          let id = heading.id;
          if (!id) {
            const text = heading.textContent?.replace("#", "").trim() || "";
            id = text
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
              .replace(/\s+/g, "-") // Replace spaces with hyphens
              .replace(/-+/g, "-") // Replace multiple hyphens with single
              .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
            heading.id = id; // Set the id on the element
          }

          return {
            id,
            text: heading.textContent?.replace("#", "").trim() || "",
          };
        },
      );

      // Filter out headings without valid ids
      const validHeadings = headingItems.filter((h) => h.id && h.text);
      setHeadings(validHeadings);

      // Intersection Observer to track which heading is active
      const observer = new IntersectionObserver(
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
        observer.observe(heading);

        // Add click handler to heading to update URL
        (heading as HTMLElement).style.cursor = "pointer";
        heading.addEventListener("click", () => {
          window.history.pushState(null, "", `#${heading.id}`);
        });
      });

      return () => observer.disconnect();
    };

    // Initial scan
    scanHeadings();

    // Retry multiple times to catch dynamically loaded content
    const timeout1 = setTimeout(scanHeadings, 500);
    const timeout2 = setTimeout(scanHeadings, 1500);
    const timeout3 = setTimeout(scanHeadings, 3000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
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
