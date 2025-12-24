"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/utils";
import type { ThemedToken } from "shiki";

const TABLE_ROWS = [
  { id: 4, score: 0.89, name: "Asian Elephant", weight: 6000 },
  { id: 1, score: 0.76, name: "African Bush Elephant", weight: 6000 },
  { id: 3, score: 0.65, name: "African Forest Elephant", weight: 4000 },
];

export function HeroDemo({ tokens }: { tokens: ThemedToken[][] }) {
  const [step, setStep] = useState(0); // 0: initial wait, 1: typing, 2: rows, 3: end wait
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [showRows, setShowRows] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runSequence = () => {
      // Reset
      setStep(0);
      setActiveLineIndex(0);
      setShowRows(false);

      // Start typing after a short delay
      timeout = setTimeout(() => {
        setStep(1);

        // Type Line 1
        // Duration: 1200ms
        setTimeout(() => {
          setActiveLineIndex(1);
          // Type Line 2
          // Duration: 800ms
          setTimeout(() => {
            setActiveLineIndex(2);
            // Type Line 3
            // Duration: 1000ms
            setTimeout(() => {
              setActiveLineIndex(3);
              // Show Rows
              setTimeout(() => {
                setStep(2);
                setShowRows(true);
                // No loop: just stop at the final state
              }, 0); // Wait after typing finishes before showing rows (increased delay)
            }, 1500); // Time to type line 3
          }, 1500); // Time to type line 2
        }, 1500); // Time to type line 1
      }, 500); // Initial delay
    };

    runSequence();

    return () => clearTimeout(timeout);
  }, []); // Run once on mount

  return (
    <div className="overflow-hidden rounded-xl bg-slate-900/90 shadow-2xl ring-1 ring-slate-800 transition-all duration-500 ease-out h-[22rem] relative">
      <div className="flex gap-2 absolute top-4 left-4 z-30">
        <div className="w-3 h-3 rounded-full bg-[#ec6a5e]" />
        <div className="w-3 h-3 rounded-full bg-[#f4bf4f]" />
        <div className="w-3 h-3 rounded-full bg-[#61c554]" />
      </div>
      <div className="relative w-full bg-transparent text-left min-h-[5.5rem] p-6 pt-12 text-sm font-mono leading-snug z-10">
        {tokens.map((lineTokens, i) => {
           // Logic to control the width animation of each line
           const width = step === 0 ? '0%' : (i <= activeLineIndex ? '100%' : '0%');

           // Delays must match the timeouts in the useEffect
           const transitionDuration = '1500ms';
           const transitionDelay = '0ms';
           const transitionTimingFunction = 'linear';

           return (
            <div key={i} className="relative flex items-center h-[1.5em]">
               {/* Fixed width line number container */}
               <div className="w-8 text-slate-600 select-none text-right pr-4 flex-shrink-0">
                  {i + 1}
               </div>

               <div
                 className="overflow-hidden whitespace-nowrap will-change-[width]"
                 style={{
                   width,
                   transitionProperty: 'width',
                   transitionDuration,
                   transitionDelay,
                   transitionTimingFunction,
                 }}
               >
                 <div className="whitespace-pre">
                   {lineTokens.map((token, j) => (
                     <span key={j} style={{ color: token.color }}>
                       {token.content}
                     </span>
                   ))}
                 </div>
               </div>
            </div>
          );
        })}
      </div>

      <div
        className={cx(
          "transition-opacity duration-1000 ease-linear absolute bottom-0 w-full z-20",
          showRows ? "opacity-100" : "opacity-0"
        )}
      >
        <div>
          <div className="border-t border-slate-800 bg-slate-900/50 p-4">
            <table className="w-full text-left text-sm text-slate-300 font-mono">
              <thead
                 className={cx(
                   "border-b border-slate-800 text-slate-500 transition-opacity duration-500",
                   showRows ? "opacity-100" : "opacity-0"
                 )}
              >
                <tr>
                  <th className="py-3 pl-4 font-medium w-20">id</th>
                  <th className="py-3 pl-4 font-medium w-32">score</th>
                  <th className="py-3 pl-4 font-medium">name</th>
                  <th className="py-3 pl-4 font-medium">weight (kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {TABLE_ROWS.map((row, index) => (
                  <tr
                    key={row.id}
                    className={cx(
                      "transition-all duration-700 ease-out",
                      showRows
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <td className="py-3 pl-4 text-indigo-400">{row.id}</td>
                    <td className="py-3 pl-4 text-emerald-400">{row.score}</td>
                    <td className="py-3 pl-4">{row.name}</td>
                    <td className="py-3 pl-4 text-slate-400">{row.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
