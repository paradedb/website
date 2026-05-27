import { ReactNode } from "react";
import { cx } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center border px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors",
        "bg-[#ebe9e5] dark:bg-slate-800 border-[#d7d4cf] dark:border-slate-700 text-[#77736d] dark:text-slate-200",
        className,
      )}
    >
      {children}
    </span>
  );
}
