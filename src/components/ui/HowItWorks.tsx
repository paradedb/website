"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";
import { RiSearchLine, RiFlashlightFill } from "@remixicon/react";
import PostgresLogo from "./PostgresLogo";
import Link from "next/link";
import { Button } from "../Button";
import { Badge } from "./Badge";
import { documentation } from "@/lib/links";

const ParadeDBIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="60 70 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={classNames(props.className, "scale-75")}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M158.322 75H130.387V180.211H158.322V75Z"
      fill="#4F46E5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M126.13 75H98.1938V180.211H126.13V75Z"
      fill="#4F46E5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M93.9357 75H66V180.211H93.9357V75Z"
      fill="#4F46E5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M162.581 75.0088V143.124C162.581 152.987 166.496 162.358 173.465 169.329C180.434 176.298 189.807 180.213 199.67 180.213H216V152.277H199.67C197.238 152.277 194.932 151.293 193.217 149.577C191.502 147.862 190.517 145.556 190.517 143.124V103.603C190.517 88.0964 178.006 75.3661 162.581 75.0105V75.0088Z"
      fill="#4F46E5"
    />
  </svg>
);

const AnimatedCell = ({
  text,
  isHighlighted,
}: {
  text: string;
  isHighlighted: boolean;
}) => {
  const [display, setDisplay] = useState<{ curr: string; prev: string | null }>(
    {
      curr: text,
      prev: null,
    },
  );

  if (text !== display.curr) {
    setDisplay({ curr: text, prev: display.curr });
  }

  useEffect(() => {
    if (display.prev) {
      const timer = setTimeout(() => {
        setDisplay((d) => ({ ...d, prev: null }));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [display.prev]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <style>{`
          @keyframes slideOutTop {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-100%); opacity: 0; }
          }
          @keyframes slideInBottom {
            0% { transform: translateY(100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}</style>

      {display.prev && (
        <div
          className={classNames(
            "absolute inset-0 flex items-center",
            "text-emerald-600 font-medium",
          )}
          style={{ animation: "slideOutTop 500ms ease-in-out forwards" }}
        >
          <span className="text-xs truncate w-full">{display.prev}</span>
        </div>
      )}

      <div
        className={classNames(
          "absolute inset-0 flex items-center",
          isHighlighted
            ? "text-emerald-600 font-medium"
            : "text-slate-700 dark:text-slate-200",
        )}
        style={{
          animation: display.prev
            ? "slideInBottom 500ms ease-in-out forwards"
            : "none",
        }}
      >
        <span className="text-xs truncate w-full">{display.curr}</span>
      </div>
    </div>
  );
};

const Table = ({
  title,
  rows,
  highlightIdx,
  icon: Icon,
  customHeader,
  isLoading = false,
  isExiting = false,
}: {
  title?: string;
  rows: { id: number; name: string; weight: string }[];
  highlightIdx: number;
  icon?: React.ElementType;
  customHeader?: React.ReactNode;
  isLoading?: boolean;
  isExiting?: boolean;
}) => (
  <div className="w-full bg-white/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden text-sm z-10 relative ring-3 ring-slate-50 dark:ring-slate-950 shadow-xl">
    <style>{`
      @keyframes slideInRow {
        0% { transform: translateY(100%); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      @keyframes slideOutRow {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(100%); opacity: 0; }
      }
    `}</style>
    <div className="bg-slate-50 dark:bg-slate-950/50 px-3 py-2 border-b border-slate-200 dark:border-slate-800 font-medium text-slate-600 dark:text-slate-400 flex justify-between items-center">
      {customHeader ? (
        <div className="w-full">{customHeader}</div>
      ) : (
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon className="h-4 w-auto text-indigo-400 dark:text-indigo-500" />
          )}
          {/* @ts-ignore */}
          <span className="text-xs uppercase tracking-wide">{title}</span>
        </div>
      )}
    </div>
    <div className="divide-y divide-slate-100 dark:divide-slate-800 min-h-[105px]">
      <div className="grid grid-cols-[30px_1fr_80px] bg-slate-100/50 dark:bg-slate-950/50 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium px-3 py-1.5">
        <div>id</div>
        <div>name</div>
        <div className="whitespace-nowrap">weight (kg)</div>
      </div>
      {isLoading
        ? // Loading State - Just white background (preserving height)
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="grid grid-cols-[30px_1fr_80px] px-3 py-2 items-center opacity-0"
            >
              {/* Invisible content to hold height */}
              <div className="h-4 w-4" />
              <div className="h-4 w-24" />
              <div className="h-4 w-8" />
            </div>
          ))
        : // Actual Rows
          rows.map((row, i) => (
            <div
              key={row.id}
              className={classNames(
                "grid grid-cols-[30px_1fr_80px] px-3 py-2 transition-colors duration-300 items-center opacity-0",
                highlightIdx === i
                  ? "bg-indigo-50 dark:bg-indigo-900/20"
                  : "bg-transparent",
              )}
              style={{
                animationName: isExiting ? "slideOutRow" : "slideInRow",
                animationDuration: "0.5s",
                animationTimingFunction: isExiting
                  ? "cubic-bezier(0.55, 0.085, 0.68, 0.53)"
                  : "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                animationFillMode: "forwards",
                animationDelay: `${i * 100}ms`,
              }}
            >
              <div className="font-mono text-xs text-indigo-600 dark:text-indigo-400">
                {row.id}
              </div>
              <div className="relative h-4 overflow-hidden w-full">
                <AnimatedCell
                  text={row.name}
                  isHighlighted={highlightIdx === i}
                />
              </div>
              <div className="relative h-4 overflow-hidden w-full">
                <AnimatedCell
                  text={row.weight}
                  isHighlighted={highlightIdx === i}
                />
              </div>
            </div>
          ))}
    </div>
  </div>
);

const SelfHostedHeader = () => (
  <div className="flex items-center justify-between w-full">
    <div className="flex items-center gap-2.5">
      <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-md shadow-sm border border-slate-200/50 dark:border-slate-700/50">
        <PostgresLogo className="h-5 w-auto" />
        <span className="text-indigo-400 dark:text-indigo-500 mx-1 font-light">
          +
        </span>
        <ParadeDBIcon className="h-5 w-auto" />
      </div>
    </div>
    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-100/50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-800">
      <RiFlashlightFill className="size-3 text-indigo-500 dark:text-indigo-300" />
      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300 tracking-wider uppercase">
        ParadeDB Installed
      </span>
    </div>
  </div>
);

function SelfHostedDemo() {
  const ANIMAL_DATA = [
    { id: 1, name: "Polar Bear", weight: "450" },
    { id: 2, name: "Grizzly Bear", weight: "270" },
    { id: 3, name: "Black Bear", weight: "135" },
    { id: 4, name: "Great White Shark", weight: "1100" },
    { id: 5, name: "Tiger Shark", weight: "600" },
    { id: 6, name: "Hammerhead Shark", weight: "230" },
    { id: 7, name: "Blue Whale", weight: "140000" },
    { id: 8, name: "Humpback Whale", weight: "30000" },
    { id: 9, name: "Killer Whale", weight: "6000" },
  ];

  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(ANIMAL_DATA.slice(0, 3));
  const [isLoading, setIsLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [highlightIdx] = useState(-1);

  // Filter rows when query changes or loading finishes
  useEffect(() => {
    // If loading or exiting, don't update rows to prevent flashing default content
    if (isLoading || isExiting) return;

    const lowerQuery = query.toLowerCase();
    if (!lowerQuery) {
      setRows(ANIMAL_DATA.slice(0, 3));
      return;
    }
    const filtered = ANIMAL_DATA.filter((item) =>
      item.name.toLowerCase().includes(lowerQuery),
    );
    // Always show up to 3 rows
    setRows(filtered.slice(0, 3));
  }, [query, isLoading, isExiting]);

  // Typing animation loop
  useEffect(() => {
    let mounted = true;
    const QUERIES = ["bear", "shark", "whale"];
    let queryIdx = 0;

    const runLoop = async () => {
      while (mounted) {
        // 1. Idle (showing previous results or default)
        if (!mounted) break;
        await new Promise((r) => setTimeout(r, 1000));

        // 2. Start Typing -> Loading State
        setIsLoading(true);

        const targetWord = QUERIES[queryIdx];
        for (let i = 1; i <= targetWord.length; i++) {
          if (!mounted) break;
          setQuery(targetWord.slice(0, i));
          await new Promise((r) => setTimeout(r, 120 + Math.random() * 50));
        }

        if (!mounted) break;

        // 3. Typing Finished -> Show Results
        await new Promise((r) => setTimeout(r, 200));
        if (!mounted) break;
        setIsLoading(false);

        // 4. Hold result
        await new Promise((r) => setTimeout(r, 2500));

        // 5. Backspace (Slide out simultaneous with deletion)
        if (!mounted) break;
        setIsExiting(true);

        for (let i = targetWord.length; i >= 0; i--) {
          if (!mounted) break;
          setQuery(targetWord.slice(0, i));
          // Slower backspace to allow animation to be seen
          await new Promise((r) => setTimeout(r, 100));
        }

        // Wait for animation tail if needed
        await new Promise((r) => setTimeout(r, 200));

        if (!mounted) break;
        setIsExiting(false);
        setIsLoading(true);
        // Force a small delay
        await new Promise((r) => setTimeout(r, 50));

        queryIdx = (queryIdx + 1) % QUERIES.length;
      }
    };

    runLoop();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center px-0 sm:px-4 relative z-10">
        <div className="flex flex-col items-stretch w-full sm:max-w-[420px] mx-auto gap-6">
          {/* Animated Search Bar - Moved Above */}
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <div className="relative group shadow-lg rounded-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <RiSearchLine className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="flex items-center w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm ring-3 ring-slate-50 dark:ring-slate-950 transition-all group-hover:border-slate-300 dark:group-hover:border-indigo-500">
                <span className="text-sm text-slate-700 dark:text-slate-200 min-h-[20px]">
                  {query}
                </span>
                <span className="w-0.5 h-5 bg-indigo-500 animate-[blink_1s_infinite] ml-0.5" />
              </div>
              <style>{`
                @keyframes blink {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0; }
                }
              `}</style>
            </div>
          </div>

          {/* Single Table with Combined Logo */}
          <Table
            rows={rows}
            highlightIdx={highlightIdx}
            customHeader={<SelfHostedHeader />}
            isLoading={isLoading}
            isExiting={isExiting}
          />
        </div>
      </div>
    </div>
  );
}

function AnimationDemo() {
  const ELEPHANT_DATA = [
    { name: "Asian Elephant", weight: "4000" },
    { name: "African Bush Elephant", weight: "6000" },
    { name: "Forest Elephant", weight: "2700" },
    { name: "Savanna Elephant", weight: "7500" },
    { name: "Indian Elephant", weight: "3500" },
    { name: "Sri Lankan Elephant", weight: "4500" },
    { name: "Sumatran Elephant", weight: "2000" },
    { name: "Borneo Elephant", weight: "1900" },
    { name: "Pygmy Elephant", weight: "1800" },
    { name: "Mammoth (Extinct)", weight: "8000" },
  ];

  const INITIAL_ROWS = [
    { id: 1, name: "Asian Elephant", weight: "4000" },
    { id: 2, name: "African Bush Elephant", weight: "6000" },
    { id: 3, name: "Forest Elephant", weight: "2700" },
  ];

  const [primaryRows, setPrimaryRows] = useState(INITIAL_ROWS);
  const [replicaRows, setReplicaRows] = useState(INITIAL_ROWS);
  const [highlightPrimary, setHighlightPrimary] = useState(-1);
  const [highlightReplica, setHighlightReplica] = useState(-1);
  const [packetState, setPacketState] = useState<
    "idle" | "moving" | "received"
  >("idle");

  useEffect(() => {
    let mounted = true;

    const runAnimation = async () => {
      let cycleCount = 0;
      let nameIndex = 3;
      let rowUpdateIndex = 0;

      while (mounted) {
        // Reset Highlight
        setHighlightPrimary(-1);
        setHighlightReplica(-1);
        setPacketState("idle");

        if (!mounted) break;
        await new Promise((r) => setTimeout(r, 1500));

        // 1. Prepare Update
        if (!mounted) break;

        // Cycle through rows sequentially (0 -> 1 -> 2 -> 0...)
        const rowToUpdateIdx = rowUpdateIndex % 3;
        rowUpdateIndex++;

        // Cycle through names sequentially
        const newData = ELEPHANT_DATA[nameIndex % ELEPHANT_DATA.length];
        nameIndex++;

        // 1b. Show Highlight First
        setHighlightPrimary(rowToUpdateIdx);
        await new Promise((r) => setTimeout(r, 300));

        // Update Primary State
        setPrimaryRows((prev) => {
          const newRows = [...prev];
          newRows[rowToUpdateIdx] = {
            ...newRows[rowToUpdateIdx],
            name: newData.name,
            weight: newData.weight,
          };
          return newRows;
        });

        // 2. Start Packet Travel
        await new Promise((r) => setTimeout(r, 200));
        if (!mounted) break;
        setPacketState("moving");

        // 3. Update Replica (Packet Received)
        await new Promise((r) => setTimeout(r, 800)); // Travel time
        if (!mounted) break;
        setPacketState("received"); // Hide packet

        // Show highlight on Replica first
        setHighlightReplica(rowToUpdateIdx);
        await new Promise((r) => setTimeout(r, 300));

        // Apply update to Replica
        setReplicaRows((prev) => {
          const newRows = [...prev];
          newRows[rowToUpdateIdx] = {
            ...newRows[rowToUpdateIdx],
            name: newData.name,
            weight: newData.weight,
          };
          return newRows;
        });

        // 4. Hold
        await new Promise((r) => setTimeout(r, 1700));

        cycleCount++;
      }
    };

    runAnimation();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent flex flex-col">
      <style>{`
        @keyframes scan {
          0% { mask-position: 0 -100%; -webkit-mask-position: 0 -100%; }
          100% { mask-position: 0 300%; -webkit-mask-position: 0 300%; }
        }
      `}</style>
      <div className="flex-1 flex flex-col justify-center items-center px-0 sm:px-4 relative z-10">
        <div className="flex flex-col items-stretch w-full sm:max-w-[420px] mx-auto">
          {/* Primary Table */}
          <Table
            title="Primary (Postgres)"
            rows={primaryRows}
            highlightIdx={highlightPrimary}
            icon={PostgresLogo}
          />

          {/* Connector */}
          <div className="h-28 lg:flex-1 w-full relative flex justify-center items-center min-h-[7rem]">
            {/* Base Dashed Line */}
            <div className="absolute top-0 h-full w-0 border-l-2 border-dashed border-indigo-300/75" />

            {/* Active Dashed Line (Lighting up) */}
            <div
              className={classNames(
                "absolute top-0 h-full w-0 border-l-2 border-dashed border-indigo-500 drop-shadow-[0_0_3px_#818cf8] transition-opacity",
                packetState === "moving"
                  ? "opacity-100 duration-75"
                  : "opacity-0 duration-200",
              )}
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)",
                maskSize: "100% 40%",
                WebkitMaskSize: "100% 40%",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                animation:
                  packetState === "moving" || packetState === "received"
                    ? "scan 0.8s linear forwards"
                    : "none",
              }}
            />

            {/* Label Pill */}
            <div className="absolute top-1/2 -translate-y-1/2 bg-indigo-50 dark:bg-slate-900 border border-transparent dark:border-slate-800 px-4 py-1.5 rounded-full shadow-xl z-30">
              <span className="text-[10px] font-mono text-indigo-800 dark:text-indigo-300 font-semibold tracking-wide">
                LOGICAL REPLICATION
              </span>
            </div>
          </div>

          {/* Replica Table */}
          <Table
            title="Replica (ParadeDB)"
            rows={replicaRows}
            highlightIdx={highlightReplica}
            icon={ParadeDBIcon}
          />
        </div>
      </div>
    </div>
  );
}

const AccordionItem = ({
  title,
  isActive,
  onClick,
  children,
  number,
}: {
  title: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  number: string;
}) => (
  <div className="px-0">
    <button
      onClick={onClick}
      className="w-full py-6 flex items-start text-left group transition-all justify-between lg:cursor-pointer cursor-default"
    >
      <h3
        className={classNames(
          "text-lg font-semibold transition-colors duration-300 flex-1",
          "text-indigo-950 dark:text-white lg:text-slate-500 lg:dark:text-slate-400",
          isActive
            ? "lg:text-indigo-950 lg:dark:text-white"
            : "lg:group-hover:text-slate-800 lg:dark:group-hover:text-slate-200",
        )}
      >
        {title}
      </h3>
      <span
        className={classNames(
          "font-mono text-md ml-6 transition-colors duration-300",
          "text-indigo-600 dark:text-indigo-400 lg:text-slate-400 lg:dark:text-slate-500",
          isActive
            ? "lg:text-indigo-600 lg:dark:text-indigo-400"
            : "lg:group-hover:text-slate-600 lg:dark:group-hover:text-slate-300",
        )}
      >
        {number}
      </span>
    </button>

    <div
      className={classNames(
        "overflow-hidden transition-all duration-500 ease-in-out",
        "max-h-[2000px] opacity-100", // Always open on mobile
        "lg:max-h-0 lg:opacity-0", // Closed by default on desktop
        isActive ? "lg:max-h-[1000px] lg:opacity-100 lg:mt-2" : "",
      )}
    >
      <div className="w-full">{children}</div>
      <div className="pb-2" />
    </div>
  </div>
);

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"managed" | "selfHosted">(
    "managed",
  );

  return (
    <div className="w-full relative opacity-0 animate-fade-in delay-1400 bg-white dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative w-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-0 items-stretch mx-auto w-full border-l border-r border-t border-slate-200 dark:border-slate-900 pb-12 md:pb-20">
          <div className="lg:col-span-5 flex flex-col justify-start py-0 lg:py-12 px-6 md:px-12 w-full min-h-fit sm:min-h-[600px] relative border-b border-slate-200 dark:border-slate-900">
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-900/50" />
            <div className="pt-8 md:pt-0">
              <Badge className="mb-6">Benefits</Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl mb-6 mt-2">
              <span className="text-highlight-blink">Zero ETL</span> means{" "}
              <br />
              zero headache
            </h2>

            {/* Dynamic Tagline & Button Area */}
            <div className="mb-12 flex flex-col justify-between">
              <p
                className="text-base sm:text-lg text-gray-800 dark:text-slate-300 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300"
                key={activeTab + "-text"}
              >
                Because ParadeDB is just Postgres, it can run as a logical
                replica of any managed Postgres, or be installed inside any
                self-hosted Postgres.
              </p>

              <div
                className="mt-6 flex w-full sm:flex-row animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75"
                key={activeTab + "-btn"}
              >
                <Button className="text-md px-6 py-2 bg-indigo-600 ring-2 ring-indigo-400 dark:ring-indigo-600/50 border-1 border-indigo-400 dark:border-indigo-600 rounded-none hover:bg-indigo-700 transition-all">
                  <Link target="_blank" href={documentation.REPLICATION}>
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex flex-col divide-y divide-slate-200 dark:divide-slate-900">
              {/* Section 1: Managed */}
              <AccordionItem
                title="For managed Postgres"
                isActive={activeTab === "managed"}
                onClick={() => setActiveTab("managed")}
                number="01"
              >
                <div className="text-gray-600 dark:text-slate-400 leading-relaxed text-sm mb-4">
                  ParadeDB can replicate from any managed Postgres — RDS,
                  Supabase, Google Cloud/Azure Postgres, Neon, etc.
                </div>

                {/* Mobile Graphic (MOVED BELOW SUBTEXT) */}
                <div className="flex lg:hidden justify-center w-full mt-4 mb-8">
                  <div className="w-full">
                    <AnimationDemo />
                  </div>
                </div>
              </AccordionItem>

              {/* Section 2: Self Hosted */}
              <AccordionItem
                title="For self-hosted Postgres"
                isActive={activeTab === "selfHosted"}
                onClick={() => setActiveTab("selfHosted")}
                number="02"
              >
                <div className="text-gray-600 dark:text-slate-400 leading-relaxed text-sm mb-4">
                  Installing ParadeDB in a self-hosted Postgres deployment
                  incurs zero infra overhead or spend.
                </div>

                {/* Mobile Graphic (MOVED BELOW SUBTEXT) */}
                <div className="flex lg:hidden justify-center w-full mt-4 mb-8">
                  <div className="w-full">
                    <SelfHostedDemo />
                  </div>
                </div>
              </AccordionItem>
            </div>
          </div>

          {/* Right Side - Desktop Only */}
          <div className="hidden lg:col-span-7 lg:block w-full relative border-b border-slate-200 dark:border-slate-900 bg-slate-100 dark:bg-slate-900/50">
            {/* Desktop Tabs */}
            <div className="flex w-full border-b border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950">
              <button
                onClick={() => setActiveTab("managed")}
                className={classNames(
                  "flex-1 flex items-center justify-center gap-3 py-4 text-sm font-medium transition-all border-b-2 outline-none",
                  activeTab === "managed"
                    ? "border-indigo-600 text-indigo-900 dark:text-white"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50",
                )}
              >
                <span
                  className={classNames(
                    "text-[10px] font-mono font-semibold",
                    activeTab === "managed"
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-400 dark:text-slate-600",
                  )}
                >
                  01
                </span>
                <span className="font-semibold tracking-tight">
                  Managed Postgres
                </span>
              </button>
              <div className="w-px bg-slate-200 dark:bg-slate-900" />
              <button
                onClick={() => setActiveTab("selfHosted")}
                className={classNames(
                  "flex-1 flex items-center justify-center gap-3 py-4 text-sm font-medium transition-all border-b-2 outline-none",
                  activeTab === "selfHosted"
                    ? "border-indigo-600 text-indigo-900 dark:text-white"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50",
                )}
              >
                <span
                  className={classNames(
                    "text-[10px] font-mono font-semibold",
                    activeTab === "selfHosted"
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-400 dark:text-slate-600",
                  )}
                >
                  02
                </span>
                <span className="font-semibold tracking-tight">
                  Self-Hosted Postgres
                </span>
              </button>
            </div>

            <div className="sticky top-24 h-[640px] w-full overflow-hidden">
              {activeTab === "managed" ? (
                <div className="w-full h-full animate-in fade-in zoom-in-95 duration-500">
                  <AnimationDemo />
                </div>
              ) : (
                <div className="w-full h-full animate-in fade-in zoom-in-95 duration-500">
                  <SelfHostedDemo />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
