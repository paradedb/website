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
    title: "Your Postgres-flavored ecosystem",
    body: "pgvector, pg_partman, pg_cron, PostGIS, and the rest of the extension catalog work side by side.",
    icon: (
      <PostgresLogo className="h-[18px] w-auto text-current opacity-90" />
    ),
    code: "CREATE EXTENSION pg_search;",
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
    <div ref={sectionRef} className="w-full relative bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900">
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
              <p className="text-base sm:text-lg text-gray-800 dark:text-slate-300 max-w-4xl leading-relaxed">
                Adopting ParadeDB is not adopting a new database. Your tables stay vanilla, with a new index that unlocks search workloads.
                Your SQL, transactions, drivers, backup strategy, high availability and other Postgres features keeps working exactly as they do today.
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

            {/* Right: what you keep */}
            <div className="lg:col-span-5">
              <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 divide-y divide-slate-100 dark:divide-slate-800/60">
                {KEEPS.map((item, i) => (
                  <div
                    key={item.title}
                    className={cx(
                      "flex gap-3 px-4 py-3.5 sm:px-5 sm:py-4 transition-all duration-700",
                      visible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-2",
                    )}
                    style={{ transitionDelay: `${i * 70}ms` }}
                  >
                    <div className="shrink-0 inline-flex p-1.5 size-fit bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-indigo-950 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}
