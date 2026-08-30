"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cx } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import PixelShadow from "./PixelShadow";
import Link from "next/link";
import { social } from "@/lib/links";
import {
  RiTerminalBoxLine,
  RiShieldKeyholeLine,
  RiHardDrive2Line,
  RiLifebuoyLine,
  RiListCheck2,
  RiPlugLine,
  RiPuzzleLine,
  RiServerLine,
} from "@remixicon/react";

const KEEPS = [
  {
    title: "Shipped as an extension",
    body: (
      <>
        Pure Postgres extension, not a fork. Drops into any self-managed
        Postgres. Or{" "}
        <Link
          href={social.CALENDLY}
          target="_blank"
          className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300"
        >
          let us run it for you
        </Link>
        .
      </>
    ),
    icon: <RiPlugLine className="size-[18px]" />,
    code: "CREATE EXTENSION pg_search;",
  },
  {
    title: "Built as an index",
    body: "No sidecar process, no external cluster — just a native index on your tables.",
    icon: <RiListCheck2 className="size-[18px]" />,
    code: "CREATE INDEX … USING paradedb;",
  },
  {
    title: "Standard SQL",
    body: "Joins, CTEs, window functions, JSONB, PL/pgSQL, row level security (RLS), materialized views. Search is a WHERE clause.",
    icon: <RiTerminalBoxLine className="size-[18px]" />,
    code: "SELECT … WHERE body &&& 'postgres'",
  },
  {
    title: "ACID transactions",
    body: "Commits, rollbacks, and foreign keys, all with read after write guarantees.",
    icon: <RiShieldKeyholeLine className="size-[18px]" />,
    code: "BEGIN; … COMMIT;",
  },
  {
    title: "Durable by default",
    body: "Writes go through the Postgres write-ahead log, so the index gets the same crash recovery guarantees as your tables.",
    icon: <RiHardDrive2Line className="size-[18px]" />,
    code: "CHECKPOINT;",
  },
  {
    title: "Replicates like Postgres",
    body: (
      <>
        High availability from physical replicas, horizontal scaling from read
        replicas. An{" "}
        <Link
          href="#pricing"
          className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-700 dark:hover:text-indigo-300"
        >
          enterprise feature
        </Link>
        .
      </>
    ),
    icon: <RiServerLine className="size-[18px]" />,
    code: "pg_basebackup -R …",
  },
  {
    title: "Your usual ops surface",
    body: "pg_dump, logical replication, high availability, pgBackRest, the dashboards and alerting your team already trusts.",
    icon: <RiLifebuoyLine className="size-[18px]" />,
    code: "pg_dump -Fc db | …",
  },
  {
    title: "The Postgres ecosystem",
    body: "pg_partman, pg_cron, PostGIS, and the rest of the extension catalog work side by side.",
    icon: <RiPuzzleLine className="size-[18px]" />,
    code: "CREATE EXTENSION pg_cron;",
  },
];

function KeepCard({
  item,
  index,
  isWide,
  visible,
}: {
  item: (typeof KEEPS)[number];
  index: number;
  isWide: boolean;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const { resolvedTheme } = useTheme();
  const activeColor = resolvedTheme === "dark" ? "#4f46e5" : "#64748b";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cx(
        "relative transition-all duration-700",
        isWide && "lg:col-span-2",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      )}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <PixelShadow
        color="#94a3b8"
        activeColor={activeColor}
        glow
        active={hovered}
        baseAlpha={0.28}
        activeBaseAlpha={0.05}
      />
      <div className="relative flex flex-col border border-slate-200 dark:border-slate-800 px-6 py-7 md:px-7 md:py-8 bg-white dark:bg-slate-950 group h-full">
        <div className="absolute top-3 right-3 font-mono text-[10px] text-slate-400 dark:text-slate-600">
          0{index + 1}
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
          <span className="text-indigo-500 dark:text-indigo-400 mr-1.5">›</span>
          {item.code}
        </div>
      </div>
    </div>
  );
}

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
      className="w-full relative bg-white dark:bg-slate-950"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative w-full">
        {/* Vertical guide lines */}
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        {/* Shaded hatch divider */}
        <div className="border-y border-slate-200 dark:border-slate-900">
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch opacity-60" />
        </div>

        <section className="relative z-40 py-10 md:py-16 border-r border-l border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950">
          {/* Header */}
          <div className="flex flex-col items-start text-left px-6 sm:px-16 lg:px-24 mb-10 md:mb-12">
            <SectionHeader
              cursor="gutter"
              eyebrow="Architecture"
              title={
                <>
                  No bespoke search engine or vector database.
                  <br />
                  Just Postgres.
                </>
              }
              description={
                <>
                  The world's{" "}
                  <Link
                    href="https://survey.stackoverflow.co/2025/technology#2-databases"
                    target="_blank"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    most-admired
                  </Link>{" "}
                  open-source database, proven in production at every scale.
                </>
              }
            />
          </div>

          {/* Keeps bento */}
          <div className="px-4 md:px-12">
            <div className="flex items-baseline gap-3 mb-6 px-2 md:px-0 max-w-[1128px] mx-auto">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
                what you get
              </span>
              <span className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 dark:text-slate-600">
                08 / 08
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pr-2.5 pb-2.5 max-w-[1128px] mx-auto">
              {KEEPS.map((item, i) => (
                <KeepCard
                  key={item.title}
                  item={item}
                  index={i}
                  isWide={i === KEEPS.length - 1}
                  visible={visible}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
