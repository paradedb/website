"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiArrowRightLine } from "@remixicon/react";

export function SiteBanner() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return (
    <div className="relative z-50 w-full bg-indigo-600">
      <Link
        href="/customers/case-study-modern-treasury"
        className="group flex w-full items-center justify-center gap-2 border-b border-white/20 bg-white/10 px-4 py-3 text-center text-xs font-medium text-white opacity-0 animate-fade-in backdrop-blur-md transition-colors hover:bg-white/15 sm:text-sm"
        style={{ animationDuration: "1800ms", animationDelay: "300ms" }}
      >
        <span className="mr-2 hidden bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide sm:inline-block sm:text-xs">
          Case Study
        </span>
        <span>ParadeDB powers Modern Treasury&apos;s core APIs</span>
        <RiArrowRightLine className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
