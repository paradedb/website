import Link from "next/link";
import { RiArrowRightLine } from "@remixicon/react";

export function SiteBanner() {
  return (
    <Link
      href="/customers/case-study-modern-treasury"
      className="relative z-50 flex w-full items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-center text-xs font-medium text-slate-900 transition-colors hover:bg-amber-400 sm:text-sm"
    >
      <span className="relative inline-flex h-2 w-2 shrink-0 rounded-full bg-slate-900" />
      <span>
        ParadeDB powers Modern Treasury&apos;s core UI and search APIs
      </span>
      <RiArrowRightLine className="size-4 shrink-0" />
    </Link>
  );
}
