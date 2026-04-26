"use client";

import { useState } from "react";
import Link from "next/link";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  RiArrowRightLine,
  RiCheckLine,
  RiClaudeFill,
  RiFileCopyLine,
  RiOpenaiFill,
} from "@remixicon/react";
import { Badge } from "./Badge";
import { PythonIcon } from "./icons/PythonIcon";
import { RubyIcon } from "./icons/RubyIcon";

const Integrations = [
  {
    name: "Anthropic",
    className: "text-[#d97757]",
    icon: <RiClaudeFill className="size-[1.1rem]" />,
  },
  {
    name: "OpenAI",
    className: "text-black dark:text-white",
    icon: <RiOpenaiFill className="size-[1.1rem]" />,
  },
  {
    name: "Gemini",
    className: "",
    icon: (
      <div className="flex size-[1.1rem] items-center justify-center rounded-full bg-white dark:bg-slate-950">
        <svg
          viewBox="0 0 24 24"
          className="size-[1.1rem]"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <path
              id="gemini-shape"
              d="M12 1.15C13.25 6.7 17.3 10.75 22.85 12 17.3 13.25 13.25 17.3 12 22.85 10.75 17.3 6.7 13.25 1.15 12 6.7 10.75 10.75 6.7 12 1.15Z"
            />
            <clipPath id="gemini-clip">
              <use href="#gemini-shape" />
            </clipPath>
            <radialGradient
              id="gemini-left"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(4.2 12.1) rotate(0) scale(9 10.5)"
            >
              <stop stopColor="#facc15" />
              <stop offset="1" stopColor="#facc15" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              id="gemini-top"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(12 4.35) rotate(90) scale(8 8.75)"
            >
              <stop stopColor="#fb4d5b" />
              <stop offset="1" stopColor="#fb4d5b" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              id="gemini-bottom"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(9.6 19.4) rotate(-28) scale(8.8 7.8)"
            >
              <stop stopColor="#22c55e" />
              <stop offset="1" stopColor="#22c55e" stopOpacity="0" />
            </radialGradient>
          </defs>
          <use href="#gemini-shape" fill="#3b82f6" />
          <g clipPath="url(#gemini-clip)">
            <rect x="0" y="0" width="24" height="24" fill="url(#gemini-left)" />
            <rect x="0" y="0" width="24" height="24" fill="url(#gemini-top)" />
            <rect
              x="0"
              y="0"
              width="24"
              height="24"
              fill="url(#gemini-bottom)"
            />
          </g>
        </svg>
      </div>
    ),
  },
  {
    name: "Cursor",
    className: "text-[#26251e] dark:text-slate-100",
    icon: (
      <svg
        viewBox="0 0 466.73 532.09"
        className="size-[1.1rem]"
        fill="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M457.43,125.94L244.42,2.96c-6.84-3.95-15.28-3.95-22.12,0L9.3,125.94c-5.75,3.32-9.3,9.46-9.3,16.11v247.99c0,6.65,3.55,12.79,9.3,16.11l213.01,122.98c6.84,3.95,15.28,3.95,22.12,0l213.01-122.98c5.75-3.32,9.3-9.46,9.3-16.11v-247.99c0-6.65-3.55-12.79-9.3-16.11h-.01ZM444.05,151.99l-205.63,356.16c-1.39,2.4-5.06,1.42-5.06-1.36v-233.21c0-4.66-2.49-8.97-6.53-11.31L24.87,145.67c-2.4-1.39-1.42-5.06,1.36-5.06h411.26c5.84,0,9.49,6.33,6.57,11.39h-.01Z"
        />
      </svg>
    ),
  },
  {
    name: "Windsurf",
    className: "text-[#0B100F] dark:text-slate-100",
    icon: (
      <svg
        viewBox="0 0 1024 1024"
        className="size-[1.1rem]"
        fill="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M897.246 286.869H889.819C850.735 286.808 819.017 318.46 819.017 357.539V515.589C819.017 547.15 792.93 572.716 761.882 572.716C743.436 572.716 725.02 563.433 714.093 547.85L552.673 317.304C539.28 298.16 517.486 286.747 493.895 286.747C457.094 286.747 423.976 318.034 423.976 356.657V515.619C423.976 547.181 398.103 572.746 366.842 572.746C348.335 572.746 329.949 563.463 319.021 547.881L138.395 289.882C134.316 284.038 125.154 286.93 125.154 294.052V431.892C125.154 438.862 127.285 445.619 131.272 451.34L309.037 705.2C319.539 720.204 335.033 731.344 352.9 735.392C397.616 745.557 438.77 711.135 438.77 667.278V508.406C438.77 476.845 464.339 451.279 495.904 451.279H495.995C515.02 451.279 532.857 460.562 543.785 476.145L705.235 706.661C718.659 725.835 739.327 737.218 763.983 737.218C801.606 737.218 833.841 705.9 833.841 667.308V508.376C833.841 476.815 859.41 451.249 890.975 451.249H897.276C901.233 451.249 904.43 448.053 904.43 444.097V294.021C904.43 290.065 901.233 286.869 897.276 286.869H897.246Z"
        />
      </svg>
    ),
  },
] as const;

const Frameworks = [
  {
    name: "Python",
    className: "text-slate-900 dark:text-slate-100",
    icon: <PythonIcon className="size-[1.6rem]" />,
    docs: [
      {
        label: "Django docs",
        url: "https://docs.paradedb.com/documentation/getting-started/environment#django",
      },
      {
        label: "SQLAlchemy docs",
        url: "https://docs.paradedb.com/documentation/getting-started/environment#sqlalchemy",
      },
    ],
  },
  {
    name: "Ruby",
    className: "text-slate-900 dark:text-slate-100 -translate-y-[2px]",
    icon: <RubyIcon className="size-[1.4rem]" />,
    docs: [
      {
        label: "ActiveRecord docs",
        url: "https://docs.paradedb.com/documentation/getting-started/environment#rails",
      },
    ],
  },
];

const CloudPlatforms = [
  {
    name: "Railway",
    className: "text-slate-900 dark:text-slate-100",
    url: "https://railway.com/deploy/paradedb?referralCode=l5qxN4&utm_medium=integration&utm_source=button&utm_campaign=paradedb",
    icon: (
      <svg
        viewBox="0 0 1024 1024"
        className="size-[1.6rem]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4.756 438.175A520.713 520.713 0 0 0 0 489.735h777.799c-2.716-5.306-6.365-10.09-10.045-14.772-132.97-171.791-204.498-156.896-306.819-161.26-34.114-1.403-57.249-1.967-193.037-1.967-72.677 0-151.688.185-228.628.39-9.96 26.884-19.566 52.942-24.243 74.14h398.571v51.909H4.756ZM783.93 541.696H.399c.82 13.851 2.112 27.517 3.978 40.999h723.39c32.248 0 50.299-18.297 56.162-40.999ZM45.017 724.306S164.941 1018.77 511.46 1024c207.112 0 385.071-123.006 465.907-299.694H45.017Z"
          fill="currentColor"
        />
        <path
          d="M511.454 0C319.953 0 153.311 105.16 65.31 260.612c68.771-.144 202.704-.226 202.704-.226h.031v-.051c158.309 0 164.193.707 195.118 1.998l19.149.706c66.7 2.224 148.683 9.384 213.19 58.19 35.015 26.471 85.571 84.896 115.708 126.52 27.861 38.499 35.876 82.756 16.933 125.158-17.436 38.97-54.952 62.215-100.383 62.215H16.69s4.233 17.944 10.58 37.751h970.632A510.385 510.385 0 0 0 1024 512.218C1024.01 229.355 794.532 0 511.454 0Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Render",
    className: "text-slate-900 dark:text-slate-100",
    url: "https://dashboard.render.com/login?next=%2Fblueprint%2Fnew%3Frepo%3Dhttps%3A%2F%2Fgithub.com%2Fparadedb%2Frender-blueprint",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 21 21"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Render"
      >
        <path d="M15.6491 0.00582604C12.9679 -0.120371 10.7133 1.81847 10.3286 4.373C10.3134 4.49154 10.2905 4.60627 10.2715 4.72099C9.67356 7.90268 6.88955 10.3119 3.5457 10.3119C2.35364 10.3119 1.23395 10.006 0.258977 9.47058C0.140914 9.40557 0 9.4897 0 9.62354V10.3081V20.6218H10.2677V12.8894C10.2677 11.4668 11.4178 10.3119 12.8346 10.3119H15.4015C18.3074 10.3119 20.6458 7.89121 20.5315 4.94662C20.4287 2.29649 18.2884 0.132023 15.6491 0.00582604Z"></path>
      </svg>
    ),
  },
  {
    name: "DigitalOcean",
    className: "text-[#0080ff]",
    docsUrl: "https://docs.paradedb.com/deploy/cloud-platforms/digitalocean",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="65.2 173.5 32 32"
        className="size-[1.6rem]"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M81.202 205.5v-6.2c6.568 0 11.666-6.5 9.144-13.418a9.27 9.27 0 0 0-5.533-5.531c-6.912-2.502-13.425 2.575-13.425 9.14H65.2c0-10.463 10.124-18.622 21.1-15.195 4.8 1.505 8.618 5.313 10.105 10.1 3.43 10.99-4.717 21.107-15.203 21.107z" />
        <path d="M75.05 199.317v-6.165h6.168v6.165zm-4.753 4.75v-4.75h4.753v4.75h-4.753zm0-4.75h-3.973v-3.97h3.973v3.97z" />
      </svg>
    ),
  },
];

// Shared component for the background grid
function GridBackground({
  cols,
  cellWidth,
}: {
  cols: number;
  cellWidth: string;
}) {
  const totalCells = cols * 5;
  const skipStart = Math.floor(totalCells / 2) - 1;
  const skipCount = cols > 6 ? 3 : 2; // 3 items for Cloud Platforms, 2 for Frameworks

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_center,black_10%,transparent_70%)] z-0">
      <div
        className={`grid grid-rows-[repeat(5,3rem)] border-l border-t border-black/[0.06] dark:border-white/[0.06]`}
        style={{ gridTemplateColumns: `repeat(${cols}, ${cellWidth})` }}
      >
        {Array.from({ length: totalCells }).map((_, i) => {
          if (i > skipStart && i < skipStart + skipCount) return null;
          if (i === skipStart) {
            return (
              <div
                key={i}
                className="border-r border-b border-black/[0.06] dark:border-white/[0.06]"
                style={{ gridColumn: `span ${skipCount}` }}
              />
            );
          }
          return (
            <div
              key={i}
              className="border-r border-b border-black/[0.06] dark:border-white/[0.06]"
            />
          );
        })}
      </div>
    </div>
  );
}

// Shared component for the corner markers
function CornerMarkers() {
  return (
    <>
      <svg
        className="absolute -top-[3px] -left-[3px] w-[6px] h-[6px] text-black/15 dark:text-white/15 z-10 pointer-events-none"
        viewBox="0 0 6 6"
        fill="none"
      >
        <path d="M3 0V6M0 3H6" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg
        className="absolute -top-[3px] -right-[3px] w-[6px] h-[6px] text-black/15 dark:text-white/15 z-10 pointer-events-none"
        viewBox="0 0 6 6"
        fill="none"
      >
        <path d="M3 0V6M0 3H6" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg
        className="absolute -bottom-[3px] -left-[3px] w-[6px] h-[6px] text-black/15 dark:text-white/15 z-10 pointer-events-none"
        viewBox="0 0 6 6"
        fill="none"
      >
        <path d="M3 0V6M0 3H6" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg
        className="absolute -bottom-[3px] -right-[3px] w-[6px] h-[6px] text-black/15 dark:text-white/15 z-10 pointer-events-none"
        viewBox="0 0 6 6"
        fill="none"
      >
        <path d="M3 0V6M0 3H6" stroke="currentColor" strokeWidth="1" />
      </svg>
    </>
  );
}

export default function AgentReady() {
  const [selectedCloud, setSelectedCloud] = useState(0);
  const [selectedFramework, setSelectedFramework] = useState(0);
  const [copiedAgent, setCopiedAgent] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAgent(true);
      setTimeout(() => setCopiedAgent(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Tooltip.Provider delayDuration={100}>
      <div className="w-full relative bg-white dark:bg-slate-950">
        <section className="overflow-hidden flex flex-col relative max-w-[1440px] mx-auto">
          <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
          <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

          <div className="px-4 md:px-12 w-full flex flex-col relative isolate">
            <div className="absolute inset-y-0 left-4 md:left-12 right-4 md:right-12 bg-slate-100 dark:bg-slate-950/50 -z-10" />
            <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
            <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />

            <div className="relative flex flex-col items-center justify-center py-16 sm:py-24 bg-transparent z-20">
              {/* Header section */}
              <div className="flex flex-col items-center w-full relative z-20 px-6 sm:px-0 text-center mb-12">
                <Badge className="mb-6">Integrations</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl mb-4">
                  Use your{" "}
                  <span className="text-indigo-600 dark:text-indigo-400">
                    favorite
                  </span>{" "}
                  tools
                </h2>
                <p className="text-base sm:text-lg text-gray-800 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  ParadeDB works seamlessly with your existing stack.
                </p>
              </div>

              {/* Nested Cards Container */}
              <div className="relative w-full z-20">
                <div className="max-w-[1128px] mx-auto grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                  {/* Card 2: Cloud Platforms */}
                  <div className="flex flex-col h-full relative overflow-hidden bg-white dark:bg-slate-900/40">
                    <div className="flex flex-col flex-1 bg-transparent px-5 sm:px-8 py-10 sm:py-12 z-10 w-full items-center">
                      <div className="w-full max-w-[460px] flex flex-col h-full">
                        <div className="flex flex-col justify-center sm:h-[102px] mb-8 relative">
                          <div className="relative flex items-center justify-center w-[10.5rem] h-[3rem] mx-auto">
                            <GridBackground cols={7} cellWidth="3.5rem" />
                            <CornerMarkers />

                            {/* Logos */}
                            <div className="relative z-20 flex items-center justify-center w-full h-full gap-2">
                              {CloudPlatforms.map((platform, index) => (
                                <Tooltip.Root key={platform.name}>
                                  <Tooltip.Trigger asChild>
                                    <button
                                      onClick={() => setSelectedCloud(index)}
                                      className={`flex size-[3rem] items-center justify-center transition-all duration-300 ${
                                        selectedCloud === index
                                          ? "opacity-100"
                                          : "opacity-50 hover:opacity-100"
                                      } ${platform.className || ""}`}
                                      aria-label={platform.name}
                                    >
                                      {platform.icon}
                                    </button>
                                  </Tooltip.Trigger>
                                  <Tooltip.Portal>
                                    <Tooltip.Content
                                      className="rounded-md bg-slate-900 px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95 dark:bg-slate-100 dark:text-slate-900 z-50"
                                      sideOffset={5}
                                    >
                                      {platform.name}
                                      <Tooltip.Arrow className="fill-slate-900 dark:fill-slate-100" />
                                    </Tooltip.Content>
                                  </Tooltip.Portal>
                                </Tooltip.Root>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col text-left flex-1">
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                            Cloud Platforms
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            Run ParadeDB on your preferred cloud platform.
                            Supports Render, Railway, and DigitalOcean with more
                            coming soon.
                          </p>
                          <Link
                            href={
                              CloudPlatforms[selectedCloud].name ===
                              "DigitalOcean"
                                ? "https://docs.paradedb.com/deploy/cloud-platforms/digitalocean"
                                : CloudPlatforms[selectedCloud].url ||
                                  "https://docs.paradedb.com/deploy/cloud-platforms"
                            }
                            target="_blank"
                            className="mt-auto flex w-fit items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                          >
                            Deploy to {CloudPlatforms[selectedCloud].name}
                            <RiArrowRightLine className="size-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 1: Coding Agents */}
                  <div className="flex flex-col h-full relative overflow-hidden bg-white dark:bg-slate-900/40">
                    <div className="flex flex-col flex-1 bg-transparent px-5 sm:px-8 py-10 sm:py-12 z-10 w-full items-center">
                      <div className="w-full max-w-[460px] flex flex-col h-full">
                        <div className="flex flex-col justify-center sm:h-[102px] mb-8">
                          <div className="hidden sm:block w-full border border-slate-200 bg-white px-3 py-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-none mb-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0 font-mono text-[0.65rem] sm:text-[0.75rem] lg:text-[0.65rem] xl:text-[0.75rem] tracking-tight leading-6 text-slate-800 dark:text-slate-100 flex items-center whitespace-nowrap overflow-hidden">
                                <span className="mr-2 font-semibold text-indigo-600 dark:text-indigo-400">
                                  $
                                </span>
                                <span className="truncate">
                                  npx skills add paradedb/agent-skills
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopy(
                                    "npx skills add paradedb/agent-skills",
                                  )
                                }
                                className="shrink-0 border border-slate-200 bg-transparent p-1.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
                                aria-label="Copy command"
                              >
                                {copiedAgent ? (
                                  <RiCheckLine className="size-[14px] text-green-600 dark:text-green-400" />
                                ) : (
                                  <RiFileCopyLine className="size-[14px]" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-4 h-[2rem] sm:mt-1">
                            {Integrations.map((integration) => (
                              <div
                                key={integration.name}
                                className={`flex size-[1.5rem] items-center justify-center grayscale opacity-60 transition-all hover:grayscale-0 hover:opacity-100 bg-transparent ${integration.className}`}
                                aria-label={integration.name}
                              >
                                {integration.icon}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col text-left flex-1">
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                            Coding Agents
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            Teach your agents to use ParadeDB with a single
                            command. Works with Claude Code, Cursor, Codex,
                            Windsurf, Gemini, and more.
                          </p>
                          <Link
                            href="https://docs.paradedb.com/welcome/ai-agents"
                            target="_blank"
                            className="mt-auto flex w-fit items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                          >
                            Learn more
                            <RiArrowRightLine className="size-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Frameworks */}
                  <div className="flex flex-col h-full relative overflow-hidden bg-white dark:bg-slate-900/40">
                    <div className="flex flex-col flex-1 bg-transparent px-5 sm:px-8 py-10 sm:py-12 z-10 w-full items-center">
                      <div className="w-full max-w-[460px] flex flex-col h-full">
                        <div className="flex flex-col justify-center sm:h-[102px] mb-8 relative">
                          <div className="relative flex items-center justify-center w-[7rem] h-[3rem] mx-auto">
                            <GridBackground cols={6} cellWidth="3.5rem" />
                            <CornerMarkers />

                            {/* Logos */}
                            <div className="relative z-20 flex items-center justify-center w-full h-full gap-2">
                              {Frameworks.map((framework, index) => (
                                <Tooltip.Root key={framework.name}>
                                  <Tooltip.Trigger asChild>
                                    <button
                                      onClick={() =>
                                        setSelectedFramework(index)
                                      }
                                      className={`flex size-[3rem] items-center justify-center transition-all duration-300 ${
                                        selectedFramework === index
                                          ? "grayscale-0 opacity-100"
                                          : "grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
                                      } bg-transparent ${framework.className}`}
                                      aria-label={framework.name}
                                    >
                                      {framework.icon}
                                    </button>
                                  </Tooltip.Trigger>
                                  <Tooltip.Portal>
                                    <Tooltip.Content
                                      className="rounded-md bg-slate-900 px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95 dark:bg-slate-100 dark:text-slate-900 z-50"
                                      sideOffset={5}
                                    >
                                      {framework.name}
                                      <Tooltip.Arrow className="fill-slate-900 dark:fill-slate-100" />
                                    </Tooltip.Content>
                                  </Tooltip.Portal>
                                </Tooltip.Root>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col text-left flex-1">
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                            Frameworks
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            Query ParadeDB from your favorite programming
                            language. Supports Django, SQLAlchemy, and
                            ActiveRecord with more coming soon.
                          </p>
                          <div className="mt-auto flex flex-col gap-2">
                            {Frameworks[selectedFramework].docs.map((doc) => (
                              <Link
                                key={doc.url}
                                href={doc.url}
                                target="_blank"
                                className="flex w-fit items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                              >
                                {doc.label}
                                <RiArrowRightLine className="size-4" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Tooltip.Provider>
  );
}
