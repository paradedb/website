"use client";

import { useEffect, useState, type ReactNode } from "react";

type Source = { src: string; type: string };

export function ZoomVideo({
  sources,
  ariaLabel,
  caption,
}: {
  sources: Source[];
  ariaLabel: string;
  caption?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <figure className="my-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Expand: ${ariaLabel}`}
          className="group relative block w-full cursor-zoom-in overflow-hidden rounded-lg border-0 bg-transparent p-0 focus:outline-none focus-visible:outline-none"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={ariaLabel}
            className="block h-auto w-full rounded-lg"
          >
            {sources.map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
          </video>
          <span className="pointer-events-none absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            Click to expand
          </span>
        </button>
        {caption && (
          <figcaption className="-mt-1 text-center text-xs leading-tight text-gray-600 dark:text-gray-400">
            {caption}
          </figcaption>
        )}
      </figure>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/85 p-4 sm:p-8"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-label={ariaLabel}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-[66.6667vw] max-w-[66.6667vw] rounded-lg shadow-2xl"
          >
            {sources.map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
          </video>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/20"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
