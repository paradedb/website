"use client";

import { RiBookOpenLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface FocusModeProps {
  className?: string;
}

interface Box {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export default function FocusMode({ className = "" }: FocusModeProps) {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [box, setBox] = useState<Box | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  useEffect(() => {
    if (!active) {
      setBox(null);
      return;
    }

    const compute = () => {
      const article = document.querySelector("article");
      const aside = document.querySelector("aside");
      if (!article) return;

      const a = article.getBoundingClientRect();
      const b = aside?.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const top = Math.max(0, Math.min(vh, b ? Math.min(a.top, b.top) : a.top));
      const bottom = Math.max(
        0,
        Math.min(vh, b ? Math.max(a.bottom, b.bottom) : a.bottom),
      );
      const left = Math.max(
        0,
        Math.min(vw, b ? Math.min(a.left, b.left) : a.left),
      );
      const right = Math.max(
        0,
        Math.min(vw, b ? Math.max(a.right, b.right) : a.right),
      );

      setBox({ top, left, right, bottom });
    };

    compute();
    window.addEventListener("scroll", compute, true);
    window.addEventListener("resize", compute);

    const article = document.querySelector("article");
    const aside = document.querySelector("aside");
    const ro = new ResizeObserver(compute);
    if (article) ro.observe(article);
    if (aside) ro.observe(aside);

    return () => {
      window.removeEventListener("scroll", compute, true);
      window.removeEventListener("resize", compute);
      ro.disconnect();
    };
  }, [active]);

  const opacity = hovered ? 0 : 0.9;
  const overlayProps = {
    "aria-hidden": true as const,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onClick: () => setActive(false),
    className:
      "fixed z-[60] cursor-pointer bg-white transition-opacity duration-300 dark:bg-slate-950",
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setActive((v) => !v)}
        aria-pressed={active}
        className={`${className} w-full`}
      >
        <RiBookOpenLine size={16} className="shrink-0" />
        {active ? "Exit focus mode" : "Read in focus mode"}
      </button>
      {mounted &&
        active &&
        box &&
        createPortal(
          <>
            <div
              {...overlayProps}
              style={{
                top: 0,
                left: 0,
                right: 0,
                height: box.top,
                opacity,
              }}
            />
            <div
              {...overlayProps}
              style={{
                top: box.bottom,
                left: 0,
                right: 0,
                bottom: 0,
                opacity,
              }}
            />
            <div
              {...overlayProps}
              style={{
                top: box.top,
                left: 0,
                width: box.left,
                height: Math.max(0, box.bottom - box.top),
                opacity,
              }}
            />
            <div
              {...overlayProps}
              style={{
                top: box.top,
                left: box.right,
                right: 0,
                height: Math.max(0, box.bottom - box.top),
                opacity,
              }}
            />
          </>,
          document.body,
        )}
    </>
  );
}
