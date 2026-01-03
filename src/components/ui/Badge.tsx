import { ReactNode } from "react";
import classNames from "classnames";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={classNames(
        "mb-4 inline-flex items-center border border-slate-100 dark:border-slate-900 bg-slate-100/50 dark:bg-slate-900/50 px-3 py-1 text-xs font-medium text-indigo-950 dark:text-white uppercase",
        className
      )}
    >
      {children}
    </span>
  );
}

