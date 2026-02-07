"use client";

import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import CopyToClipboard from "./CopyToClipboard";

export default function CodeBlockEnhancer() {
  useEffect(() => {
    const addCopyButtons = () => {
      const preElements = document.querySelectorAll("pre code");

      preElements.forEach((codeElement) => {
        const preElement = codeElement.parentElement;
        if (!preElement || preElement.querySelector(".copy-button-wrapper")) {
          return;
        }

        const code = codeElement.textContent || "";

        if (code.trim()) {
          const wrapper = document.createElement("div");
          wrapper.className = "copy-button-wrapper";
          wrapper.style.cssText =
            "position: absolute; right: 0; top: 0; z-index: 10; pointer-events: none;";

          const buttonContainer = document.createElement("div");
          buttonContainer.className = "absolute right-3 top-3";
          buttonContainer.style.cssText = "pointer-events: auto;";
          buttonContainer.id = `copy-btn-${Math.random().toString(36).substr(2, 9)}`;

          wrapper.appendChild(buttonContainer);
          preElement.appendChild(wrapper);

          const root = createRoot(buttonContainer);
          root.render(<CopyToClipboard code={code} />);
        }
      });
    };

    addCopyButtons();

    const timer = setTimeout(addCopyButtons, 500);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
