import { type ReactNode } from "react";
import { cx } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  cursor = "column",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  /**
   * Horizontal anchor for the cursor tick so it lands on the left rule:
   * "column" for headers aligned to the 1128px content column,
   * "gutter" for headers using the splash px-16/px-24 gutter.
   */
  cursor?: "column" | "gutter";
}) {
  return (
    <div
      className={cx(
        "flex flex-col items-start text-left relative z-40",
        className,
      )}
    >
      <p className="font-mono text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
        {eyebrow}
      </p>
      <h2 className="relative text-2xl sm:text-4xl font-semibold tracking-tight leading-[1.15] text-slate-900 dark:text-white">
        <span
          aria-hidden="true"
          className={cx(
            "hidden sm:block absolute translate-x-[calc(-50%+0.5px)] top-[0.15em] h-[0.9em] w-[3px] bg-indigo-600 z-40",
            cursor === "gutter"
              ? "left-[-65px] lg:left-[-97px]"
              : "-left-12 xl:left-[calc(612px_-_min(100vw,1440px)/2)]",
          )}
        />
        {title}
      </h2>
      {description && (
        <p className="text-lg sm:text-xl font-normal leading-[1.4] text-slate-600 dark:text-slate-300 mt-4 max-w-3xl">
          {description}
        </p>
      )}
    </div>
  );
}
