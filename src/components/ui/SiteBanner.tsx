import Link from "next/link";
import { RiArrowRightLine } from "@remixicon/react";

export function SiteBanner() {
  return (
    <Link
      href="/customers/case-study-modern-treasury"
      className="relative z-50 flex w-full items-center justify-center gap-2 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-700 px-4 py-2 text-center text-xs font-medium text-white transition-colors hover:from-indigo-600 hover:via-indigo-500 hover:to-indigo-600 sm:text-sm"
    >
      <span className="relative inline-flex h-2 w-2 shrink-0 rounded-full bg-white" />
      <span>
        ParadeDB powers Modern Treasury&apos;s core UI and search APIs
      </span>
      <RiArrowRightLine className="size-4 shrink-0" />
    </Link>
  );
}
