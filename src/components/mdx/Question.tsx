import type { ReactNode } from "react";

export function Question({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 mb-0 border-l-[3px] border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/40 py-3 px-5 rounded-tr-lg font-semibold text-gray-800 dark:text-gray-200 [&>p]:mb-0">
      {children}
    </div>
  );
}

export function Answer({ children }: { children: ReactNode }) {
  return (
    <div className="-mt-4 mb-8 border-l-[3px] border-indigo-400 dark:border-indigo-500 py-4 px-5 [&>p:last-child]:mb-0 [&>ul]:mb-0">
      {children}
    </div>
  );
}
