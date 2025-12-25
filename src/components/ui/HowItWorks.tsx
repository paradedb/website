"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";
import Image from "next/image";
import { Badge } from "../Badge";
import { RiStackLine, RiShieldCheckLine, RiPuzzle2Line } from "@remixicon/react";
import PostgresLogo from "./PostgresLogo";
import AwsLogo from "./logos/AwsLogo";
import SupabaseLogo from "./logos/SupabaseLogo";

const ParadeDBIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="60 70 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={classNames(props.className, "scale-75")}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M158.322 75H130.387V180.211H158.322V75Z" fill="#4F46E5"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M126.13 75H98.1938V180.211H126.13V75Z" fill="#4F46E5"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M93.9357 75H66V180.211H93.9357V75Z" fill="#4F46E5"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M162.581 75.0088V143.124C162.581 152.987 166.496 162.358 173.465 169.329C180.434 176.298 189.807 180.213 199.67 180.213H216V152.277H199.67C197.238 152.277 194.932 151.293 193.217 149.577C191.502 147.862 190.517 145.556 190.517 143.124V103.603C190.517 88.0964 178.006 75.3661 162.581 75.0105V75.0088Z" fill="#4F46E5"/>
  </svg>
);

const AnimatedCell = ({ text, isHighlighted }: { text: string; isHighlighted: boolean }) => {
  const [display, setDisplay] = useState<{ curr: string; prev: string | null }>({
    curr: text,
    prev: null,
  });

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
            "text-green-400 font-medium"
          )}
          style={{ animation: "slideOutTop 500ms ease-in-out forwards" }}
        >
          <span className="text-xs truncate w-full">{display.prev}</span>
        </div>
      )}

      <div
        className={classNames(
          "absolute inset-0 flex items-center",
          isHighlighted ? "text-green-400 font-medium" : "text-slate-300"
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
}: {
  title: string;
  rows: { id: number; name: string; weight: string }[];
  highlightIdx: number;
  icon?: React.ElementType;
}) => (
  <div className="w-full bg-slate-900 shadow-xl border border-slate-800 rounded-lg overflow-hidden text-sm z-10 relative">
    <div className="bg-slate-900/50 px-3 py-2 border-b border-slate-800 font-medium text-slate-400 flex justify-between items-center">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-auto text-slate-400" />}
        <span className="text-xs uppercase tracking-wide">{title}</span>
      </div>
    </div>
    <div className="divide-y divide-slate-800">
      <div className="grid grid-cols-[30px_1fr_60px] bg-slate-900/50 text-[10px] uppercase tracking-wider text-slate-500 font-medium px-3 py-1.5">
        <div>id</div>
        <div>name</div>
        <div>weight</div>
      </div>
      {rows.map((row, i) => (
        <div
          key={row.id}
          className={classNames(
            "grid grid-cols-[30px_1fr_60px] px-3 py-2 transition-colors duration-300 items-center",
            highlightIdx === i ? "bg-slate-800/60" : "bg-transparent"
          )}
        >
          <div className="font-mono text-xs text-indigo-400">{row.id}</div>
          <div className="relative h-4 overflow-hidden w-full">
            <AnimatedCell text={row.name} isHighlighted={highlightIdx === i} />
          </div>
          <div className="relative h-4 overflow-hidden w-full">
            <AnimatedCell text={row.weight} isHighlighted={highlightIdx === i} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

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
  const [packetState, setPacketState] = useState<"idle" | "moving" | "received">("idle");

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
        setPrimaryRows(prev => {
            const newRows = [...prev];
            newRows[rowToUpdateIdx] = {
              ...newRows[rowToUpdateIdx],
              name: newData.name,
              weight: newData.weight
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
        setReplicaRows(prev => {
            const newRows = [...prev];
            newRows[rowToUpdateIdx] = {
              ...newRows[rowToUpdateIdx],
              name: newData.name,
              weight: newData.weight
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
    <div className="w-full h-full relative overflow-hidden py-4 px-4 bg-indigo-50/50 border border-indigo-100/50 flex flex-col justify-center">
      <style>{`
        @keyframes scan {
          0% { mask-position: 0 -100%; -webkit-mask-position: 0 -100%; }
          100% { mask-position: 0 300%; -webkit-mask-position: 0 300%; }
        }
      `}</style>
      {/* Background Mesh/Effect */}
      <div className="absolute inset-0 z-0 opacity-75">
        <Image
          src="/mesh_1.svg"
          alt="Background Gradient"
          fill
          className="object-cover opacity-100"
        />
      </div>

      <div className="flex flex-col items-center w-full max-w-[420px] mx-auto relative z-10">
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
          <div className="h-full w-px border-l-2 border-dashed border-slate-700" />

          {/* Active Dashed Line (Lighting up) */}
          <div
            className={classNames(
              "absolute top-0 h-full w-px border-l-2 border-dashed border-indigo-400 drop-shadow-[0_0_3px_#818cf8] transition-opacity",
              packetState === "moving" ? "opacity-100 duration-75" : "opacity-0 duration-200"
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
          <div className="absolute top-1/2 -translate-y-1/2 bg-indigo-100 px-4 py-1.5 rounded-full shadow-xl z-30">
            <span className="text-[10px] font-mono text-indigo-800 font-semibold tracking-wide">
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
  );
}

export default function HowItWorks() {
  return (
    <div className="px-2 md:px-12">
      <section className="mt-12 overflow-hidden flex flex-col border-3 border-transparent">
        <div
          className="relative flex flex-col items-center justify-center px-4 sm:py-20 py-8"
        >
          <div className="w-full flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <div className="flex flex-col justify-start h-full py-0 lg:py-8 w-full">
              <div className="w-fit">
                <Badge>How It Works</Badge>
              </div>
              <h2 className="mt-4 text-4xl font-bold tracking-tighter text-indigo-900 sm:text-6xl">
                <span className="text-indigo-600">Zero ETL</span> means <br/>zero headache
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                ParadeDB is built on Postgres, which means it can run as a logical replica of any primary Postgres.
              </p>

              {/* Graphic - Mobile Only (Hidden on Desktop) */}
              <div className="flex lg:hidden justify-center w-full mt-8">
                <div className="w-full max-w-md">
                  <AnimationDemo />
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div className="border-t border-gray-200"></div>
                <div className="flex gap-4 items-start">
                    <RiStackLine className="size-5 text-indigo-600 shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-gray-900">No sync overhead</h3>
                        <p className="mt-2 text-gray-600">
                            Eliminate complex third-party tools like ETL, Kafka, or Debezium.
                        </p>
                    </div>
                </div>
                <div className="border-t border-gray-200"></div>
                <div className="flex gap-4 items-start">
                    <RiShieldCheckLine className="size-5 text-indigo-600 shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-gray-900">No data loss</h3>
                        <p className="mt-2 text-gray-600">
                            ParadeDB uses native Postgres replication so you'll never lose data.
                        </p>
                    </div>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex items-center gap-4">
                   <RiPuzzle2Line className="text-indigo-600 size-5 shrink-0" />
                   <div className="flex items-center gap-4">
                     <span className="font-semibold text-gray-900">Compatible with any Postgres</span>
                     <div className="flex items-center gap-4">
                        <PostgresLogo className="h-6 w-auto transition-all duration-300" />
                        <AwsLogo className="h-6 w-auto transition-all duration-300" />
                        <SupabaseLogo className="h-6 w-auto shrink-0 transition-all duration-300" />
                     </div>
                   </div>
                </div>
              </div>
            </div>
            {/* Graphic - Desktop Only (Hidden on Mobile) */}
            <div className="hidden lg:flex justify-center lg:justify-end w-full h-full">
              <div className="w-full max-w-xl h-full">
                <AnimationDemo />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
