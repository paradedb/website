import { ReactNode } from "react";
import classNames from "classnames";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={classNames(
        "mb-4 inline-flex items-center border border-slate-100 bg-slate-100/50 px-3 py-1 text-xs font-medium text-indigo-950 uppercase",
        className
      )}
    >
      {children}
    </span>
  );
}

