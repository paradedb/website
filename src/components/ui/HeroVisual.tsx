"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import for the shader component to prevent SSR issues
const Dithering = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.Dithering),
  { ssr: false },
);

export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden px-4 md:px-12 opacity-0 animate-fade-in delay-1000"
    >
      <div className="relative w-full h-[120px] md:h-[180px] flex items-center justify-center overflow-hidden">
        {/* Paper Dithering Background */}
        {isVisible && (
          <div className="absolute inset-0 pointer-events-none opacity-100">
            <Dithering
              width="100%"
              height="100%"
              colorBack="#4f46e500"
              colorFront="#6366f1"
              shape="wave"
              type="8x8"
              size={8}
              speed={0.25}
              scale={1.4}
            />
          </div>
        )}
      </div>
    </div>
  );
}
