import Link from "next/link";
import type { ReactNode } from "react";
import { RiArrowRightLine } from "@remixicon/react";
import { cx } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { PixelChart } from "./PixelArt";
import { documentation, github } from "@/lib/links";

const STATS: Array<{
  key: string;
  stat: string;
  label: string;
  description: string;
  cta: string;
  href: string;
  tileClassName: string;
  matClassName: string;
  art: ReactNode;
}> = [
  {
    key: "docker",
    stat: "2.5M+",
    label: "Docker deployments",
    description:
      "Our Docker image is the easiest way to quickly spin up ParadeDB.",
    cta: "Run Docker image",
    href: documentation.GETTING_STARTED,
    tileClassName: "bg-sky-500",
    matClassName: "bg-sky-500/20",
    art: <PixelChart kind="steps" />,
  },
  {
    key: "github",
    stat: "9K+",
    label: "Stargazers on GitHub",
    description: "ParadeDB is one of the fastest-growing database projects.",
    cta: "Star ParadeDB",
    href: github.REPO,
    tileClassName: "bg-indigo-600",
    matClassName: "bg-indigo-600/20",
    art: <PixelChart kind="identicons" />,
  },
  {
    key: "contributors",
    stat: "140+",
    label: "Open-source contributors",
    description:
      "New faces are always welcome. Pick up an issue and ship it with us.",
    cta: "Meet our contributors",
    href: `${github.REPO}/graphs/contributors`,
    tileClassName: "bg-emerald-600",
    matClassName: "bg-emerald-600/20",
    art: <PixelChart kind="grid" />,
  },
];

export default function CommunityProof() {
  return (
    <div className="w-full relative bg-transparent">
      <section className="overflow-hidden flex flex-col relative max-w-[1440px] mx-auto">
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        <div className="px-4 md:px-12 w-full flex flex-col relative">
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-y border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />

          <div className="relative w-full px-6 sm:px-16 lg:px-24 py-10 sm:py-16 lg:py-24 bg-white dark:bg-slate-950">
            <SectionHeader
              eyebrow="Community"
              title="Loved by developers."
              description="Open source since day one. Always."
              cursor="gutter"
              className="mb-10 md:mb-12"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {STATS.map((s) => (
                <div key={s.key} className="flex flex-col">
                  <div className={cx("p-2", s.matClassName)}>
                    <div
                      className={cx(
                        "relative aspect-[4/3] overflow-hidden",
                        s.tileClassName,
                      )}
                    >
                      {s.art}
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col flex-1">
                    <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                      {s.stat}
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {s.label}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                      {s.description}
                    </p>
                    <Link
                      href={s.href}
                      target="_blank"
                      className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                      {s.cta}
                      <RiArrowRightLine className="size-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-y border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />
        </div>
      </section>
    </div>
  );
}
