import CodeBlockEnhancer from "@/components/CodeBlockEnhancer";
import { cx } from "@/lib/utils";

interface ContentLayoutShellProps {
  topBar?: React.ReactNode;
  mobileNav?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  bottomBar?: React.ReactNode;
  isIndex: boolean;
}

export function ContentLayoutShell({
  topBar,
  mobileNav,
  sidebar,
  children,
  bottomBar,
  isIndex,
}: ContentLayoutShellProps) {
  return (
    <div className="w-full relative opacity-0 animate-fade-in delay-300 bg-white dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto relative w-full">
        <section className="bg-white dark:bg-slate-950 flex flex-col relative">
          {/* Shaded Hatch Region below navbar */}
          <div className="px-4 md:px-12 w-full relative z-20">
            <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-b border-x border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />
          </div>

          {topBar}

          {/* Outer Vertical Layout Borders */}
          <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
          <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

          {mobileNav}

          <div className="flex relative z-20 w-full px-4 md:px-12">
            {sidebar}

            <main
              className={cx(
                "relative flex flex-col",
                isIndex
                  ? "w-full lg:flex-1 lg:min-w-0 px-0"
                  : "flex-1 min-w-0 pl-4 md:pl-12 pr-0 pt-8 pb-4",
              )}
            >
              <div
                className={cx("w-full mx-auto", isIndex ? "" : "max-w-none")}
              >
                <div className="w-full">{children}</div>
              </div>
            </main>
          </div>

          {bottomBar}

          {/* Shaded Hatch Region above footer */}
          <div className="px-4 md:px-12 w-full relative z-20">
            <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-t border-x border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />
          </div>
        </section>
        <CodeBlockEnhancer />
      </div>
    </div>
  );
}
