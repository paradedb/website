import Link from "next/link";
import { RiArrowRightLine } from "@remixicon/react";

export function SiteBanner() {
  return (
    <Link
      href="/customers/case-study-modern-treasury"
      className="group relative z-50 flex w-full items-center justify-center gap-2 bg-indigo-950 px-4 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-indigo-900 sm:text-sm"
    >
      <span>
        <span className="text-white/60">Case study —</span> ParadeDB powers
        Modern Treasury&apos;s core UI and search APIs
      </span>
      <RiArrowRightLine className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
