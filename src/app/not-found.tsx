import { Button } from "@/components/Button";
import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import Link from "next/link";
import { siteConfig } from "./siteConfig";

export default function NotFound() {
  return (
    <div className="w-full relative opacity-0 animate-fade-in delay-300 bg-white dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto relative w-full">
        <section className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 flex flex-col relative">
          {/* Shaded Hatch Region below navbar */}
          <div className="px-4 md:px-12 w-full relative z-20">
            <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-b border-x border-slate-200 dark:border-slate-900 relative z-20 bg-white dark:bg-slate-950 opacity-60" />
          </div>

          {/* Outer Vertical Layout Borders */}
          <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
          <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

          <div className="flex flex-col items-center justify-center min-h-[60vh] relative z-20 px-4 py-20">
            <p className="text-4xl font-semibold text-indigo-600 sm:text-5xl">
              404
            </p>
            <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white text-center">
              Page not found
            </h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-sm text-center">
              Sorry, we couldn’t find the page you’re looking for. It might have
              been moved or deleted.
            </p>
            <Button asChild className="group mt-8" variant="light">
              <Link href={siteConfig.baseLinks.home}>
                Go to home page
                <ArrowAnimated
                  className="stroke-slate-900 dark:stroke-white"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>

          {/* Shaded Hatch Region above footer */}
          <div className="px-4 md:px-12 w-full relative z-20">
            <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-t border-x border-slate-200 dark:border-slate-900 relative z-20 bg-white dark:bg-slate-950 opacity-60" />
          </div>
        </section>
      </div>
    </div>
  );
}
