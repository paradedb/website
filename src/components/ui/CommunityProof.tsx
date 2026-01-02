"use client";

import Link from "next/link";
import { RiArrowRightLine, RiGithubFill } from "@remixicon/react";
import { Badge } from "./Badge";
import DockerLogo from "./DockerLogo";
import PostgresLogo from "./PostgresLogo";
import { documentation, github } from "@/lib/links";

export default function CommunityProof() {
  return (
    <div className="w-full">
      <section className="overflow-hidden flex flex-col relative">
        <div className="absolute inset-y-0 left-2 md:left-12 w-px bg-slate-200 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-2 md:right-12 w-px bg-slate-200 z-30 pointer-events-none" />

        <div className="px-2 md:px-12 w-full flex flex-col relative">
          {/* Section: Loved by Developers (White Background) */}
          <div className="relative flex flex-col items-center justify-center bg-white">
            <div className="relative w-full z-20">
              <div className="grid grid-cols-1 md:grid-cols-4 bg-white divide-y md:divide-y-0 divide-slate-200">
                {/* Heading Column */}
                <div className="p-8 md:p-12 md:py-24 text-left flex flex-col items-start md:border-r border-slate-200">
                  <Badge className="mb-6 bg-slate-100/50 border-slate-200">
                    Open Source
                  </Badge>
                  <h2 className="text-4xl font-bold tracking-tighter text-indigo-950 mb-4">
                    <span className="text-highlight-blink">Loved</span> by developers
                  </h2>
                  <p className="text-md text-gray-800 leading-relaxed">
                    We are committed to building the best open source search
                    experience for Postgres.
                  </p>
                </div>

                {/* Docker Card */}
                <div className="p-8 md:p-12 md:py-24 flex flex-col items-start text-left">
                  <div className="mb-8 flex items-center justify-center size-8">
                    <DockerLogo className="w-full h-full" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-950 mb-2">
                    450K+
                  </div>
                  <div className="font-semibold text-slate-900 mb-2">
                    Docker deployments
                  </div>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Our Docker image is the easiest way to quickly spin up
                    ParadeDB.
                  </p>
                  <Link
                    href={documentation.DOCKER}
                    target="_blank"
                    className="mt-auto flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Run Docker image
                    <RiArrowRightLine className="size-4" />
                  </Link>
                </div>

                {/* extension Card */}
                <div className="p-8 md:p-12 md:py-24 flex flex-col items-start text-left">
                  <div className="mb-8 flex items-center justify-center size-8 text-slate-900">
                    <PostgresLogo className="w-full h-full" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-950 mb-2">
                    100K+
                  </div>
                  <div className="font-semibold text-slate-900 mb-2">
                    Postgres extension installs
                  </div>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    All our features are shipped as a Postgres extension, which
                    means that ParadeDB can drop into any self-managed Postgres.
                  </p>
                  <Link
                    href={documentation.DEPLOY_EXTENSION}
                    target="_blank"
                    className="mt-auto flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Install extension
                    <RiArrowRightLine className="size-4" />
                  </Link>
                </div>

                {/* GitHub Card */}
                <div className="p-8 md:p-12 md:py-24 flex flex-col items-start text-left">
                  <div className="mb-8 flex items-center justify-center size-8">
                    <RiGithubFill className="w-full h-full text-slate-900" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-950 mb-2">
                    8K+
                  </div>
                  <div className="font-semibold text-slate-900 mb-2">
                    Stargazers on Github
                  </div>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    ParadeDB is one of the fastest-growing open source database
                    projects.
                  </p>
                  <Link
                    href={github.REPO}
                    target="_blank"
                    className="mt-auto flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Star ParadeDB
                    <RiArrowRightLine className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

