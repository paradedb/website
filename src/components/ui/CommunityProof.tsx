import Link from "next/link";
import { RiArrowRightLine, RiGithubFill, RiGroupLine } from "@remixicon/react";
import DockerLogo from "./DockerLogo";
import { documentation, github } from "@/lib/links";

export default function CommunityProof() {
  return (
    <div className="w-full relative bg-transparent">
      <section className="overflow-hidden flex flex-col relative max-w-[1440px] mx-auto">
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        <div className="px-4 md:px-12 w-full flex flex-col relative">
          {/* Top Shaded Region */}
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-y border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />

          {/* Section: Loved by Developers (White Background) */}
          <div className="relative flex flex-col items-center justify-center bg-white dark:bg-slate-950">
            <div className="relative w-full">
              <div className="grid grid-cols-1 md:grid-cols-4 bg-white dark:bg-slate-950 divide-y md:divide-y-0 divide-slate-200 dark:divide-slate-900">
                {/* Heading Column */}
                <div className="p-8 md:p-12 md:py-24 text-left flex flex-col items-start md:border-r border-slate-200 dark:border-slate-900">
                  <p className="font-mono text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
                    Open Source
                  </p>
                  <h2 className="relative text-2xl sm:text-3xl font-semibold tracking-tight leading-[1.15] text-slate-900 dark:text-white mb-4">
                    <span
                      aria-hidden="true"
                      className="hidden sm:block absolute -left-8 md:-left-12 translate-x-[calc(-50%+0.5px)] top-[0.15em] h-[0.9em] w-[3px] bg-indigo-600 z-40"
                    />
                    Loved by developers.
                  </h2>
                  <p className="text-md text-slate-600 dark:text-slate-300 leading-relaxed">
                    Open source since day one—and always will be.
                  </p>
                </div>

                {/* Docker Card */}
                <div className="p-8 md:p-12 md:py-24 flex flex-col items-start text-left">
                  <div className="mb-8 flex items-center justify-center size-8">
                    <DockerLogo className="w-full h-full dark:brightness-0 dark:invert" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-950 dark:text-white mb-2">
                    2.5M+
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Docker deployments
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    Our Docker image is the easiest way to quickly spin up
                    ParadeDB.
                  </p>
                  <Link
                    href={documentation.GETTING_STARTED}
                    target="_blank"
                    className="mt-auto flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    Run Docker image
                    <RiArrowRightLine className="size-4" />
                  </Link>
                </div>

                {/* Contributors Card */}
                <div className="p-8 md:p-12 md:py-24 flex flex-col items-start text-left">
                  <div className="mb-8 flex items-center justify-center size-8 text-slate-900 dark:text-slate-100">
                    <RiGroupLine className="w-full h-full" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-950 dark:text-white mb-2">
                    130+
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Open-source contributors
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    ParadeDB is built in the open by a growing community of
                    developers.
                  </p>
                  <Link
                    href={`${github.REPO}/graphs/contributors`}
                    target="_blank"
                    className="mt-auto flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    Meet our contributors
                    <RiArrowRightLine className="size-4" />
                  </Link>
                </div>

                {/* GitHub Card */}
                <div className="p-8 md:p-12 md:py-24 flex flex-col items-start text-left">
                  <div className="mb-8 flex items-center justify-center size-8">
                    <RiGithubFill className="w-full h-full text-slate-900 dark:text-slate-100" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-950 dark:text-white mb-2">
                    9K+
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Stargazers on GitHub
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    ParadeDB is one of the fastest-growing open source database
                    projects.
                  </p>
                  <Link
                    href={github.REPO}
                    target="_blank"
                    className="mt-auto flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    Star ParadeDB
                    <RiArrowRightLine className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Shaded Region */}
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch border-y border-slate-200 dark:border-slate-900 relative z-20 bg-slate-50/50 dark:bg-slate-900/50 opacity-60" />
        </div>
      </section>
    </div>
  );
}
