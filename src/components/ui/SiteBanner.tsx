import Link from "next/link";
import { RiArrowRightLine } from "@remixicon/react";

export function SiteBanner() {
  return (
    <Link
      href="/customers/case-study-modern-treasury"
      className="group relative z-50 flex w-full items-center justify-center gap-3 bg-indigo-950 px-4 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-indigo-900 sm:text-sm"
    >
      <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white sm:text-[11px]">
        Case study
      </span>
      <span>
        ParadeDB powers Modern Treasury&apos;s core UI and search APIs
      </span>
      <RiArrowRightLine className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
