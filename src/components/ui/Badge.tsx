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
        "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300",
        className,
      )}
    >
      {children}
    </span>
  );
}
