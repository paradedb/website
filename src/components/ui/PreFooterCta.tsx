"use client";

import { documentation, social } from "@/lib/links";
import Link from "next/link";
import { Button } from "../Button";
import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamic import for the shader component to prevent SSR issues
const Dithering = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.Dithering),
  { ssr: false },
);

export default function PreFooterCta() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full relative opacity-0 animate-fade-in delay-2200 bg-indigo-600">
      <section className="overflow-hidden flex flex-col relative max-w-[1440px] mx-auto">
        {/* Global Vertical Lines */}
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-white/20 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-white/20 z-30 pointer-events-none" />

        <div className="px-4 md:px-12 w-full flex flex-col relative">
          {/* Top Shaded Region */}
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch-white border-b border-white/20 relative z-20 bg-indigo-700/20 opacity-40" />

          <div className="relative flex flex-col items-center justify-center pt-16 md:pt-32 pb-4 md:pb-8 text-center">
            <div className="relative z-20 flex flex-col items-center px-6 sm:px-0">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-white sm:text-6xl leading-[1.1] text-center">
                Elastic-quality search <br className="hidden sm:block" />{" "}
                without the{" "}
                <span className="text-highlight-blink !text-white after:!bg-white/10 after:!bg-gradient-to-r after:!from-white/20 after:!to-transparent">
                  complexity
                </span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
                <Button
                  asChild
                  className="text-md px-4 bg-white rounded-none h-10 text-indigo-600 font-semibold shadow-none hover:bg-indigo-50 border-0"
                >
                  <Link
                    href={social.CALENDLY}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book a Demo
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="text-md hover:group hover:bg-white/10 bg-transparent border-0 h-10 px-4 dark:hover:bg-transparent"
                >
                  <Link
                    href={documentation.BASE}
                    className="text-white flex items-center gap-2"
                    target="_blank"
                  >
                    Documentation
                    <ArrowAnimated
                      className="stroke-white"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Dither wave upright at the bottom, matching hero style */}
          <div className="relative w-full h-[120px] md:h-[180px] flex items-center justify-center overflow-hidden opacity-0 animate-fade-in delay-300">
            {mounted && (
              <div className="absolute inset-0 pointer-events-none">
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
                  rotation={0}
                />
              </div>
            )}
          </div>

          {/* Bottom Shaded Region */}
          <div className="h-8 md:h-12 w-full bg-diagonal-hatch-white border-t border-white/20 relative z-20 bg-indigo-700/20 opacity-40" />
        </div>
      </section>
    </div>
  );
}
