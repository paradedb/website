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
        "mb-4 inline-flex items-center border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-indigo-950 dark:text-white uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
