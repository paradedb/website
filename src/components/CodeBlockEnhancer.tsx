"use client";

import { useEffect } from "react";
import CopyToClipboard from "./CopyToClipboard";

export default function CodeBlockEnhancer() {
  useEffect(() => {
    // Find all pre elements that contain code
    const preElements = document.querySelectorAll("pre code");

    preElements.forEach((codeElement) => {
      const preElement = codeElement.parentElement;
      if (!preElement || preElement.querySelector(".copy-button-wrapper")) {
        return; // Skip if already processed
      }

      // Get the text content of the code
      const code = codeElement.textContent || "";

      if (code.trim()) {
        // Create wrapper for copy button
        const wrapper = document.createElement("div");
        wrapper.className = "copy-button-wrapper absolute right-0 h-full";
        wrapper.style.cssText =
          "position: absolute; right: 0; height: 100%; z-index: 10;";

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "absolute right-3 top-3";
        buttonContainer.id = `copy-btn-${Math.random().toString(36).substr(2, 9)}`;

        wrapper.appendChild(buttonContainer);

        // Make pre element relative positioned
        preElement.style.position = "relative";
        preElement.appendChild(wrapper);

        // Render React component into the container
        import("react-dom/client").then(({ createRoot }) => {
          const root = createRoot(buttonContainer);
          root.render(<CopyToClipboard code={code} />);
        });
      }
    });
  }, []);

  return null;
}
