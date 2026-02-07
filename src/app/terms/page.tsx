"use client";

import MarkdownWrapper from "@/components/MarkdownWrapper";
import TermsContent from "./index.mdx";

export default function TermsPage() {
  return (
    <div className="w-full relative bg-white dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto relative w-full">
        <section className="bg-white dark:bg-slate-950 flex flex-col relative">
          <div className="px-4 md:px-12 w-full relative z-20">
            <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-b border-x border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />
          </div>
          <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
          <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
          <div className="flex relative z-20 w-full px-4 md:px-12">
            <main className="relative flex flex-col flex-1 min-w-0 px-4 md:px-12 pt-8 pb-4">
              <div className="w-full mx-auto max-w-none">
                <MarkdownWrapper>
                  <TermsContent />
                </MarkdownWrapper>
              </div>
            </main>
          </div>
          <div className="px-4 md:px-12 w-full relative z-20">
            <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-t border-x border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />
          </div>
        </section>
      </div>
    </div>
  );
}
