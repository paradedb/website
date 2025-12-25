"use client";

import { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import Image from "next/image";
import { Badge } from "../Badge";
import { RiStackLine, RiShieldCheckLine, RiDatabase2Line } from "@remixicon/react";
import PostgresLogo from "./PostgresLogo";
import AwsLogo from "./logos/AwsLogo";
import SupabaseLogo from "./logos/SupabaseLogo";

const ParadeDBIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 256 256"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M158.322 75H130.387V180.211H158.322V75Z" fill="#4F46E5"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M126.13 75H98.1938V180.211H126.13V75Z" fill="#4F46E5"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M93.9357 75H66V180.211H93.9357V75Z" fill="#4F46E5"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M162.581 75.0088V143.124C162.581 152.987 166.496 162.358 173.465 169.329C180.434 176.298 189.807 180.213 199.67 180.213H216V152.277H199.67C197.238 152.277 194.932 151.293 193.217 149.577C191.502 147.862 190.517 145.556 190.517 143.124V103.603C190.517 88.0964 178.006 75.3661 162.581 75.0105V75.0088Z" fill="#4F46E5"/>
  </svg>
);

const ReplicationPill = ({ active }: { active: boolean }) => {
  return (
    <div className={classNames("h-full flex flex-col items-center justify-center transition-all duration-500", active ? "opacity-100" : "grayscale")}>
       <style jsx>{`
        @keyframes flowGradient {
            from { stroke-dashoffset: 30; }
            to { stroke-dashoffset: -370; }
        }
        .animate-flow-line {
            animation: flowGradient 3s linear infinite;
        }
      `}</style>

      {/* Top Line */}
      <div className="flex-1 w-[2px] relative overflow-visible">
         <svg className="w-full h-full absolute inset-0 overflow-visible">
             {/* Background gray line */}
            <line
                x1="1" y1="0" x2="1" y2="100%"
                stroke="#cbd5e1"
                strokeWidth="2"
                className={classNames("transition-opacity duration-500", active ? "opacity-100" : "opacity-0")}
            />
            {/* Flowing green segment */}
             <line
                x1="1" y1="0" x2="1" y2="100%"
                stroke="#4ade80"
                strokeWidth="2"
                strokeDasharray="30 370"
                strokeDashoffset="30"
                className={classNames(active ? "opacity-100 animate-flow-line" : "opacity-0")}
                strokeLinecap="round"
                pathLength="100"
                style={{ animationDelay: '1.5s' }}
            />
         </svg>
      </div>

      {/* Badge with animated border effect */}
      <div className="relative z-10 my-2">
         {/* Moving glow behind/border */}
         <div className={classNames(
             "absolute inset-0 bg-green-400 blur-sm transition-opacity duration-300",
             active ? "opacity-40 animate-pulse" : "opacity-0"
         )} />

         <div className={classNames(
            "relative px-4 py-1.5 text-xs font-semibold border backdrop-blur-sm transition-all duration-500 whitespace-nowrap overflow-hidden",
            active
              ? "bg-white/80 border-green-400 text-green-700 shadow-sm scale-110"
              : "bg-white border-slate-200 text-slate-400 scale-100"
         )}>
             {/* Shine effect passing through */}
             <div className={classNames(
                 "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-green-100/50 to-transparent",
                 active && "animate-[shimmer_3s_infinite]"
             )} style={{ animationDelay: '2.3s' }} />
            Logical Replication
         </div>
      </div>

      {/* Bottom Line */}
      <div className="flex-1 w-[2px] relative overflow-visible">
         <svg className="w-full h-full absolute inset-0 overflow-visible">
             {/* Background gray line */}
             <line
                x1="1" y1="0" x2="1" y2="100%"
                stroke="#cbd5e1"
                strokeWidth="2"
                className={classNames("transition-opacity duration-500", active ? "opacity-100" : "opacity-0")}
            />
            {/* Flowing green segment */}
             <line
                x1="1" y1="0" x2="1" y2="100%"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeDasharray="30 370"
                strokeDashoffset="30"
                className={classNames(active ? "opacity-100 animate-flow-line" : "opacity-0")}
                strokeLinecap="round"
                pathLength="100"
                style={{ animationDelay: '2.7s' }}
            />
         </svg>
      </div>
    </div>
  )
}

function AnimationDemo() {
  const [step, setStep] = useState(0);
  const [pubText, setPubText] = useState("");
  const [subText, setSubText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const PUB_CMD = "CREATE PUBLICATION";
  const SUB_CMD = "CREATE SUBSCRIPTION";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.4 } // Trigger when 40% visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let mounted = true;

    const runAnimation = async () => {
      // Loop forever
      while (mounted) {
        // Reset
        setStep(0);
        setPubText("");
        setSubText("");

        if (!mounted) break;
        await new Promise((r) => setTimeout(r, 500));

        // Step 1: Supabase expands
        if (!mounted) break;
        setStep(1);

        for (let i = 0; i <= PUB_CMD.length; i++) {
          if (!mounted) break;
          await new Promise((r) => setTimeout(r, 50));
          setPubText(PUB_CMD.slice(0, i));
        }

        if (!mounted) break;
        await new Promise((r) => setTimeout(r, 500));

        // Step 2: ParadeDB expands
        setStep(2);

        for (let i = 0; i <= SUB_CMD.length; i++) {
          if (!mounted) break;
          await new Promise((r) => setTimeout(r, 50));
          setSubText(SUB_CMD.slice(0, i));
        }

        if (!mounted) break;
        await new Promise((r) => setTimeout(r, 1000));

        // Step 3: Text Fades / Collapse
        setStep(3);

        if (!mounted) break;
        await new Promise((r) => setTimeout(r, 1000));

        // Step 4: Replication Live
        setStep(4);

        // Hold result for 10 animation cycles (10 * 3s = 30s)
        for (let k = 0; k < 6; k++) {
          if (!mounted) break;
          await new Promise((r) => setTimeout(r, 3000));
        }
      }
    };

    runAnimation();

    return () => {
      mounted = false;
    };
  }, [hasStarted]);

  return (
    <div ref={containerRef} className="w-full relative overflow-hidden p-8 bg-indigo-100">

      <style jsx>{`
        @keyframes doublePulse {
          0%, 100% { transform: scale(1); }
          12% { transform: scale(1.03); }
          24% { transform: scale(1); }
          36% { transform: scale(1.03); }
          48% { transform: scale(1); }
        }
        .animate-double-pulse {
            animation: doublePulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* Mesh Background Border Effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/mesh_1.svg"
          alt="Background Gradient"
          fill
          className="object-cover opacity-80"
          priority
        />
        {/* Soft white overlay to improve text contrast if needed */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
      </div>

      {/* Inner Content Container - Clean Slate Background */}
      <div className="relative z-10 w-full h-[360px] sm:h-[560px] flex flex-col items-center justify-between py-12 px-4 bg-white/50 backdrop-blur-md shadow-sm border border-white/50">

        {/* Horizontal Dotted Line */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 px-8">
            <div className="w-full border-t-2 border-dashed border-[#cbd5e1]" />
        </div>

        {/* Supabase Side (Top) */}
        <div className="relative flex flex-col items-center justify-center gap-4 z-10 w-full h-1/3">
          <div
            className={classNames(
                "flex items-center justify-center transition-all duration-700 ease-out p-4 shadow-sm border",
                step >= 1 && step < 3 ? "shadow-xl pr-8 border-slate-200" : "border-transparent",
                step >= 4 ? "shadow-xl bg-[#3ECF8E]/10 animate-double-pulse" : "bg-white grayscale border border-transparent"
            )}
          >
             {/* Inline Supabase Logo */}
             <svg width="40" height="40" viewBox="0 0 109 113" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10 shrink-0">
                <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#supabase_paint0_linear)"/>
                <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#supabase_paint1_linear)" fillOpacity="0.2"/>
                <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E"/>
                <defs>
                <linearGradient id="supabase_paint0_linear" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
                <stop stopColor="#249361"/>
                <stop offset="1" stopColor="#3ECF8E"/>
                </linearGradient>
                <linearGradient id="supabase_paint1_linear" x1="36.1558" y1="30.578" x2="54.4844" y2="65.0806" gradientUnits="userSpaceOnUse">
                <stop/>
                <stop offset="1" stopOpacity="0"/>
                </linearGradient>
                </defs>
            </svg>

            {/* Typewriter Text */}
            <div className={classNames(
                "overflow-hidden transition-all duration-500 ease-in-out font-mono text-[10px] sm:text-base flex items-center",
                step >= 1 && step < 3 ? "w-auto ml-2 sm:ml-4 opacity-100" : "w-0 opacity-0"
            )}>
                <span className="whitespace-nowrap text-slate-700">
                    <span className="text-green-400 mr-2">$</span>
                    {pubText}
                    <span className="animate-pulse">_</span>
                </span>
            </div>
          </div>
        </div>

        {/* Connection Space - Centered Pill */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[35%] flex flex-col items-center justify-center z-20">
             <ReplicationPill active={step >= 4} />
        </div>

        {/* ParadeDB Side (Bottom) */}
        <div className="relative flex flex-col items-center justify-center gap-4 z-10 w-full h-1/3">
           <div
            className={classNames(
                "relative z-10 flex items-center justify-center transition-all duration-700 ease-out p-4 shadow-sm border",
                 step >= 2 && step < 3 ? "shadow-xl pr-8 border-slate-200" : "border-transparent",
                 step >= 4 ? "shadow-xl bg-indigo-100 animate-double-pulse" : "bg-white grayscale border border-transparent"
            )}
            style={step >= 4 ? { animationDelay: '3.45s' } : {}}
           >
             {/* ParadeDB Icon */}
             <ParadeDBIcon className="w-8 h-8 md:w-10 md:h-10 shrink-0 scale-125 relative z-20" />

             {/* Typewriter Text */}
            <div className={classNames(
                "overflow-hidden transition-all duration-500 ease-in-out font-mono text-[10px] sm:text-base flex items-center relative z-20",
                step >= 2 && step < 3 ? "w-auto ml-2 sm:ml-4 opacity-100" : "w-0 opacity-0"
            )}>
                <span className="whitespace-nowrap text-slate-700">
                    <span className="text-indigo-400 mr-2">$</span>
                    {subText}
                    <span className="animate-pulse">_</span>
                </span>
            </div>
           </div>
        </div>

      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <div className="px-2 md:px-12">
      <section className="ring-1 ring-indigo-100 border-3 border-indigo-50 mt-12 overflow-hidden flex flex-col">
        <div
          className="relative flex flex-col items-center justify-center bg-indigo-50/50 px-6 sm:px-16 sm:py-20 py-8"
        >
          <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="flex flex-col justify-start h-full py-0 lg:py-8 lg:col-span-3 w-full">
              <div className="w-fit">
                <Badge>How It Works</Badge>
              </div>
              <h2 className="mt-4 text-4xl font-bold tracking-tighter text-indigo-900 sm:text-6xl">
                <span className="text-indigo-600">Zero ETL</span> means <br/>zero headache
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                ParadeDB is a Postgres extension, which means it can run as a logical replica of any primary Postgres.
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
                            No complex third-party tools like ETL, Kafka, or Debezium.
                        </p>
                    </div>
                </div>
                <div className="border-t border-gray-200"></div>
                <div className="flex gap-4 items-start">
                    <RiShieldCheckLine className="size-5 text-indigo-600 shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-gray-900">Zero data loss</h3>
                        <p className="mt-2 text-gray-600">
                            Never lose data again because of a broken sync with Elastic. ParadeDB always stays in sync.
                        </p>
                    </div>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex items-center gap-4">
                   <RiDatabase2Line className="text-indigo-600 size-5 shrink-0" />
                   <div className="flex items-center gap-4">
                     <span className="font-semibold text-gray-900">Compatible with</span>
                     <div className="flex items-center gap-4">
                        <PostgresLogo className="h-6 w-auto transition-all duration-300" />
                        <AwsLogo className="h-6 w-auto transition-all duration-300" />
                        <SupabaseLogo className="h-6 w-auto transition-all duration-300" />
                     </div>
                   </div>
                </div>
              </div>
            </div>
            {/* Graphic - Desktop Only (Hidden on Mobile) */}
            <div className="hidden lg:flex justify-center lg:justify-end w-full lg:col-span-2">
              <div className="w-full max-w-md">
                <AnimationDemo />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
