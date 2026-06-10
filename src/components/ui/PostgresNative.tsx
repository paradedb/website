"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/utils";
import { Badge } from "./Badge";
import { Button } from "../Button";
import Link from "next/link";
import { documentation } from "@/lib/links";
import PostgresLogo from "./PostgresLogo";
import {
  RiTerminalBoxLine,
  RiShieldKeyholeLine,
  RiLifebuoyLine,
  RiCloudLine,
  RiBracketsLine,
  RiArrowRightLine,
} from "@remixicon/react";

const KEEPS = [
  {
    title: "Your SQL",
    body: "Joins, CTEs, window functions, JSONB, PL/pgSQL, materialized views. Search is a WHERE clause.",
    icon: <RiTerminalBoxLine className="size-[18px]" />,
    code: "SELECT … WHERE body @@@ 'k6'",
  },
  {
    title: "Your transactions",
    body: "ACID, MVCC, foreign keys. The index reads the rows the latest transaction wrote.",
    icon: <RiShieldKeyholeLine className="size-[18px]" />,
    code: "BEGIN; … COMMIT;",
  },
  {
    title: "Your drivers and ORMs",
    body: "psycopg, node-postgres, pgx, ActiveRecord, Django, SQLAlchemy, Drizzle, EF Core. No client rewrite.",
    icon: <RiBracketsLine className="size-[18px]" />,
    code: "conn.execute(sql)",
  },
  {
    title: "Your ops surface",
    body: "pg_dump, logical replication, pgBackRest, your existing dashboards and alerting. Same on-call runbook.",
    icon: <RiLifebuoyLine className="size-[18px]" />,
    code: "pg_dump -Fc db | …",
  },
  {
    title: "Your managed Postgres",
    body: "Run ParadeDB as a logical replica of RDS, Supabase, Neon, Cloud SQL, or Azure. No migration off your primary.",
    icon: <RiCloudLine className="size-[18px]" />,
    code: "CREATE PUBLICATION …",
  },
  {
    title: "Your Postgres-flavored ecosystem",
    body: "pgvector, pg_partman, pg_cron, PostGIS, and the rest of the extension catalog work side by side.",
    icon: (
      <PostgresLogo className="h-[18px] w-auto text-current opacity-90" />
    ),
    code: "CREATE EXTENSION pg_search;",
  },
];

const ECOSYSTEM_BADGES = [
  "postgres",
  "psql",
  "pg_dump",
  "logical replication",
  "pgvector",
  "PostGIS",
  "pg_partman",
  "pg_cron",
  "drizzle",
  "django",
  "sqlalchemy",
  "rails",
  "ef core",
  "rds",
  "supabase",
  "neon",
  "cloud sql",
  "crunchy",
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
    <div ref={sectionRef} className="w-full relative bg-white dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative w-full">
        {/* Vertical guide lines */}
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        <section className="relative py-16 md:py-24 border-r border-l border-slate-200 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-950">
          {/* Header */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 px-6 md:px-12 mb-14 md:mb-16">
            <div className="lg:col-span-7">
              <Badge className="mb-6">Postgres-native</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl mb-6">
                You&rsquo;re still <br className="hidden sm:block" />
                <span className="text-highlight-blink">in Postgres</span>.
              </h2>
              <p className="text-base sm:text-lg text-gray-800 dark:text-slate-300 max-w-2xl leading-relaxed">
                Adopting ParadeDB is not adopting a new database. The heap stays
                vanilla. Your SQL, your transactions, your drivers, your backup
                strategy, your managed Postgres provider — all of it keeps
                working exactly as it does today.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                <Button asChild className="text-md px-6 py-2 bg-indigo-600 ring-2 ring-indigo-400 dark:ring-indigo-600/50 border-1 border-indigo-400 dark:border-indigo-600 rounded-none hover:bg-indigo-700 transition-all">
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

            {/* Right: compatibility receipt */}
            <div className="lg:col-span-5">
              <div className="relative border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
                    pg_compat.log
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    all green
                  </span>
                </div>
                <div className="p-5 font-mono text-[12px] leading-[1.85] space-y-1 text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-slate-400 dark:text-slate-600">$</span>{" "}
                    psql -h paradedb -c &lsquo;\dx&rsquo;
                  </div>
                  <div className="text-slate-500 dark:text-slate-500">
                    pg_search   │ 0.18.x │ search workloads
                  </div>
                  <div className="text-slate-500 dark:text-slate-500">
                    pgvector    │ 0.8.x  │ vector type
                  </div>
                  <div className="text-slate-500 dark:text-slate-500">
                    pg_partman  │ 5.x    │ partition mgmt
                  </div>
                  <div className="pt-3 mt-3 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="text-emerald-600 dark:text-emerald-400">
                      ✓ heap          unchanged
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      ✓ transactions  ACID, MVCC
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      ✓ drivers       libpq wire protocol
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      ✓ backups       pg_dump, pg_basebackup
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      ✓ replication   logical &amp; physical
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Keeps grid */}
          <div className="px-4 md:px-12">
            <div className="flex items-baseline gap-3 mb-6 px-2 md:px-0">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
                what you keep
              </span>
              <span className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 dark:text-slate-600">
                06 / 06
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-y border-l border-slate-200 dark:border-slate-800">
              {KEEPS.map((item, i) => (
                <div
                  key={item.title}
                  className={cx(
                    "relative border-r border-b last:border-b-0 sm:[&:nth-child(n+5)]:border-b-0 lg:[&:nth-child(n+4)]:border-b-0 border-slate-200 dark:border-slate-800 px-6 py-7 md:px-7 md:py-8 bg-white dark:bg-slate-950 group transition-all duration-700",
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
                  <div className="font-mono text-[11px] text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 inline-flex">
                    <span className="text-indigo-500 dark:text-indigo-400 mr-1.5">
                      ›
                    </span>
                    {item.code}
                  </div>
                </div>
              ))}
            </div>

            {/* Ecosystem ticker */}
            <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-2 px-2 md:px-0">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 mr-2">
                drops into:
              </span>
              {ECOSYSTEM_BADGES.map((name, i) => (
                <span
                  key={name}
                  className={cx(
                    "inline-flex items-center font-mono text-[11px] px-2 py-0.5 border transition-colors",
                    "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400",
                    "bg-white dark:bg-slate-900/60",
                    visible ? "opacity-100" : "opacity-0",
                  )}
                  style={{
                    transition: "opacity 600ms ease",
                    transitionDelay: `${300 + i * 30}ms`,
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
