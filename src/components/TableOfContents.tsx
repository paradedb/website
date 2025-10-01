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
      const headingItems: TOCItem[] = Array.from(headingElements).map((heading) => ({
        id: heading.id,
        text: heading.textContent?.replace("#", "").trim() || "",
      }));
      
      setHeadings(headingItems);

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
        }
      );

      headingElements.forEach((heading) => observer.observe(heading));

      return () => observer.disconnect();
    };

    // Initial scan
    scanHeadings();
    
    // Retry after a delay in case content is still loading
    const timeout = setTimeout(scanHeadings, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 hidden lg:block z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-64">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Contents</h3>
        <nav>
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`block text-sm transition-colors duration-200 hover:text-indigo-600 ${
                    activeId === heading.id
                      ? "text-indigo-600 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}