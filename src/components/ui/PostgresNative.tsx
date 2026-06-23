"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/utils";
import { Badge } from "./Badge";
import { Button } from "../Button";
import Link from "next/link";
import { documentation } from "@/lib/links";
import {
  RiTerminalBoxLine,
  RiShieldKeyholeLine,
  RiLifebuoyLine,
  RiPlugLine,
  RiPuzzleLine,
  RiArrowRightLine,
} from "@remixicon/react";

const KEEPS = [
  {
    title: "Built as an extension",
    body: "Pure Postgres extension. Drops into any self-managed Postgres with no fork and no separate server.",
    icon: <RiPlugLine className="size-[18px]" />,
    code: "CREATE EXTENSION pg_search;",
  },
  {
    title: "Standard SQL",
    body: "Joins, CTEs, window functions, JSONB, PL/pgSQL, materialized views. Search is a WHERE clause.",
    icon: <RiTerminalBoxLine className="size-[18px]" />,
    code: "SELECT … WHERE body &&& 'postgres'",
  },
  {
    title: "ACID transactions",
    body: "Real isolation levels, MVCC, foreign keys. The index reads the rows the latest transaction wrote.",
    icon: <RiShieldKeyholeLine className="size-[18px]" />,
    code: "BEGIN; … COMMIT;",
  },
  {
    title: "Your usual ops surface",
    body: "pg_dump, logical replication, pgBackRest, the dashboards and alerting your team already trusts.",
    icon: <RiLifebuoyLine className="size-[18px]" />,
    code: "pg_dump -Fc db | …",
  },
  {
    title: "The Postgres ecosystem",
    body: "pgvector, pg_partman, pg_cron, PostGIS, and the rest of the extension catalog work side by side.",
    icon: <RiPuzzleLine className="size-[18px]" />,
    code: "CREATE EXTENSION vector;",
  },
];

export default function PostgresNative() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-80px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="w-full relative bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative w-full">
        {/* Vertical guide lines */}
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        <section className="relative py-10 md:py-16 border-r border-l border-slate-200 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-950">
          {/* Header */}
          <div className="flex flex-col items-center text-center px-6 sm:px-12 mb-10 md:mb-12">
            <Badge className="mb-6">Postgres-native</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl mb-6 max-w-4xl">
              Built on <span className="text-highlight-blink">Postgres</span>.
            </h2>
            <p className="text-base sm:text-lg text-gray-800 dark:text-slate-300 max-w-4xl leading-relaxed">
              The world's{" "}
              <Link
                href="https://survey.stackoverflow.co/2025/technology#2-databases"
                target="_blank"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline underline-offset-4 decoration-indigo-300 dark:decoration-indigo-700"
              >
                most-admired
              </Link>{" "}
              open-source database, proven in production at every scale.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
              <Button
                asChild
                className="text-md px-6 py-2 bg-indigo-600 ring-2 ring-indigo-400 dark:ring-indigo-600/50 border-1 border-indigo-400 dark:border-indigo-600 rounded-none hover:bg-indigo-700 transition-all"
              >
                <Link href={documentation.GETTING_STARTED} target="_blank">
                  Install in your Postgres
                </Link>
              </Button>
              <Link
                href={documentation.BASE}
                target="_blank"
                className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                Browse the SQL reference
                <RiArrowRightLine className="size-4" />
              </Link>
            </div>
          </div>

          {/* Keeps bento */}
          <div className="px-4 md:px-12">
            <div className="flex items-baseline gap-3 mb-6 px-2 md:px-0">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
                what you get
              </span>
              <span className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 dark:text-slate-600">
                05 / 05
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-y border-l border-slate-200 dark:border-slate-800">
              {KEEPS.map((item, i) => {
                const isWide = i === KEEPS.length - 1;
                return (
                  <div
                    key={item.title}
                    className={cx(
                      "relative flex flex-col border-r border-b border-slate-200 dark:border-slate-800 px-6 py-7 md:px-7 md:py-8 bg-white dark:bg-slate-950 group transition-all duration-700",
                      isWide && "lg:col-span-2",
                      visible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2",
                    )}
                    style={{ transitionDelay: `${i * 70}ms` }}
                  >
                    <div className="absolute top-3 right-3 font-mono text-[10px] text-slate-400 dark:text-slate-600">
                      0{i + 1}
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="inline-flex p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-base text-indigo-950 dark:text-white tracking-tight">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {item.body}
                    </p>
                    <div className="mt-auto self-start font-mono text-[11px] text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 inline-flex">
                      <span className="text-indigo-500 dark:text-indigo-400 mr-1.5">
                        ›
                      </span>
                      {item.code}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
