"use client";

import { blog } from "@/lib/links";
import Link from "next/link";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { ArrowAnimated } from "./ArrowAnimated";
import Bilt from "./logos/Bilt";
import Alibaba from "./logos/Alibaba";
import classNames from "classnames";
import { useState } from "react";

const caseStudies = [
  {
    metric: 95,
    unit: "%",
    description: "Fewer Query Timeouts",
    logo: () => <Bilt fill="white" className="h-6 md:h-8" />,
    link: blog.find((b) => b.href === "case_study_bilt")?.href,
    bgStyle: "bg-gray-900",
    textStyle: "text-slate-100",
    hoverColor: "rgba(255,255,255,0.2)",
  },
  {
    metric: 500,
    unit: "%",
    description: "Higher Search Throughput",
    logo: () => <Alibaba fill="black" className="h-6 md:h-8" />,
    link: blog.find((b) => b.href === "case_study_alibaba")?.href,
    bgStyle: "bg-orange-50",
    textStyle: "text-gray-900",
    hoverColor: "rgba(255,102,0,0.5)",
  },
];

export default function SearchAnalytics() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState<number | null>(null);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
    setIsHovering(index);
  };

  const handleMouseLeave = () => {
    setIsHovering(null);
  };

  return (
    <section
      aria-labelledby="code-example-title"
      className="mx-auto mt-28 w-full max-w-6xl px-3"
    >
      <Badge>Case Studies</Badge>
      <h2 className="mt-2 inline-block bg-clip-text py-2 text-4xl font-bold tracking-tighter text-gray-900 sm:text-6xl md:text-6xl">
        Battled-Tested in Production
      </h2>
      <p className="mt-2 max-w-2xl text-gray-600 md:mt-6 md:text-lg">
        ParadeDB powers search and analytics for some of the most demanding
        enterprise applications.
      </p>
      <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4">
        {caseStudies.map((study, index) => (
          <div
            key={index}
            className="relative col-span-2 h-max max-w-2xl animate-slide-up-fade sm:ml-auto sm:w-full md:col-span-1 group"
            style={{ animationDuration: "1400ms" }}
          >
            <Link href={`/blog/${study.link}`} target="_blank">
              <div
                className={classNames(
                  "rounded-lg relative overflow-hidden",
                  study.bgStyle,
                  "py-8 px-8 hover:cursor-pointer duration-300",
                )}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Base gradient overlay - always visible */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background:
                      index === 1
                        ? `radial-gradient(1000px circle at calc(0% - 16px) calc(100% + 16px), ${study.hoverColor}, transparent 60%)`
                        : isHovering === index
                          ? `radial-gradient(1000px circle at ${mousePosition.x}px ${mousePosition.y}px, ${study.hoverColor}, transparent 60%)`
                          : `radial-gradient(1000px circle at calc(100% + 16px) calc(100% + 16px), ${study.hoverColor}, transparent 60%)`,
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />

                {/* Hover gradient overlay - only on hover */}
                {isHovering === index && (
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(1000px circle at ${mousePosition.x}px ${mousePosition.y}px, ${study.hoverColor}, transparent 50%)`,
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />
                )}

                <div className="relative z-10">
                  <study.logo />
                  <div
                    className={classNames(
                      "text-6xl md:text-8xl font-medium",
                      study.textStyle,
                      "mt-12 md:mt-20",
                    )}
                  >
                    {study.metric}
                    <span className="text-5xl md:text-7xl font-normal">
                      {study.unit}
                    </span>
                  </div>
                  <p className={classNames("mt-2", study.textStyle)}>
                    {study.description}
                  </p>
                  <Button
                    className={classNames(
                      "group mt-12 md:mt-16 bg-transparent hover:bg-transparent px-0",
                      study.textStyle,
                    )}
                    variant="light"
                  >
                    Read Story
                    <ArrowAnimated
                      className={classNames(study.textStyle)}
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
