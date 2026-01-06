import { ReactNode } from "react";
import classNames from "classnames";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={classNames(
        "inline-flex items-center border px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors",
        "bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-200",
        className,
      )}
    >
      {children}
    </span>
  );
}
