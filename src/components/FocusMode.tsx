"use client";

import { RiBookOpenLine, RiCloseLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface FocusModeProps {
  className?: string;
}

export default function FocusMode({ className = "" }: FocusModeProps) {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (active) html.classList.add("focus-mode");
    else html.classList.remove("focus-mode");
    return () => html.classList.remove("focus-mode");
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <>
      <button
        type="button"
        onClick={() => setActive(true)}
        className={`${className} w-full`}
      >
        <RiBookOpenLine size={16} className="shrink-0" />
        Read in focus mode
      </button>
      {mounted &&
        active &&
        createPortal(
          <button
            type="button"
            onClick={() => setActive(false)}
            aria-label="Exit focus mode (Esc)"
            className="fixed top-4 right-4 z-[60] flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-colors"
          >
            <RiCloseLine size={16} className="shrink-0" />
            Exit focus mode
          </button>,
          document.body,
        )}
    </>
  );
}
