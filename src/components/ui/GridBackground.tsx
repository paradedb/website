"use client";

import { useState, useEffect } from "react";
import classNames from "classnames";

function GridSquare() {
  const [pos, setPos] = useState<{ col: number; row: number } | null>(null);
  const [timing, setTiming] = useState<{
    duration: number;
    delay: number;
  } | null>(null);

  useEffect(() => {
    setPos({
      col: Math.floor(Math.random() * 30) - 15,
      row: Math.floor(Math.random() * 10) + 3,
    });
    setTiming({
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 5,
    });
  }, []);

  if (!pos || !timing) return null;

  return (
    <div
      className="absolute w-6 h-6 bg-indigo-300/20 dark:bg-slate-600/30"
      style={{
        left: "50%",
        top: 0,
        transform: `translate(calc(${pos.col} * 24px - 12px), ${pos.row * 24}px)`,
        opacity: 0,
        animation: `grid-pulse ${timing.duration}s ease-in-out infinite`,
        animationDelay: `${timing.delay}s`,
      }}
      onAnimationIteration={() => {
        setPos({
          col: Math.floor(Math.random() * 30) - 15,
          row: Math.floor(Math.random() * 10) + 3,
        });
      }}
    />
  );
}

export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      className={classNames(
        "absolute inset-0 -z-10 h-full w-full bg-grid-pattern bg-[size:24px_24px] bg-[position:center_top] [mask-image:radial-gradient(ellipse_40%_25%_at_50%_25%,#000_0%,transparent_100%)]",
        className,
      )}
    >
      {/* Filled squares */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <GridSquare key={i} />
        ))}
      </div>
    </div>
  );
}
