"use client";

// Removed dynamic blog import
import Link from "next/link";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { ArrowAnimated } from "./ArrowAnimated";
import Bilt from "./logos/Bilt";
import Alibaba from "./logos/Alibaba";
import classNames from "classnames";

const caseStudies = [
  {
    metric: 95,
    unit: "%",
    description: "Fewer Query Timeouts",
    logo: () => <Bilt fill="black" className="h-6 md:h-8" />,
    link: "case_study_bilt",
    imageBgStyle: "bg-slate-50",
    bgStyle: "bg-slate-50",
    textStyle: "text-gray-600 rounded-2xl py-1 px-3 border border-slate-200",
    title: "Bilt Reduces Postgres Query Timeouts by 95% with ParadeDB",
    hoverColor: "rgba(255,255,255,0.2)",
  },
  {
    metric: 5,
    unit: "x",
    description: "Read Throughput",
    logo: () => <Alibaba fill="#ff6600" className="h-6 md:h-8" />,
    link: "case_study_alibaba",
    imageBgStyle: "bg-slate-50",
    bgStyle: "bg-slate-50",
    textStyle: "text-gray-600 rounded-2xl py-1 px-3 border border-slate-200",
    title:
      "Alibaba Picks ParadeDB to Bring Full Text Search to its Postgres-Based Data Warehouse",
    hoverColor: "rgba(255,102,0,0.5)",
  },
];

export default function SearchAnalytics() {
  return (
    <section
      aria-labelledby="code-example-title"
      className="mx-auto mt-28 w-full max-w-6xl px-3"
    >
      <Badge>Case Studies</Badge>
      <h2 className="mt-2 inline-block bg-clip-text py-2 text-4xl font-bold tracking-tighter text-gray-900 sm:text-6xl md:text-6xl">
        Battled-tested in production
      </h2>
      <p className="mt-2 max-w-2xl text-gray-600 md:mt-6 md:text-lg">
        ParadeDB powers search and analytics for some of the most demanding
        enterprise applications.
      </p>
      <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4 items-stretch">
        {caseStudies.map((study, index) => (
          <div
            key={index}
            className="relative col-span-2 mx-auto h-full max-w-2xl animate-slide-up-fade rounded-2xl md:hover:shadow-xl md:hover:shadow-indigo-200 sm:ml-auto sm:w-full md:col-span-1 duration-300"
          >
            <div className="rounded-2xl bg-slate-50 p-2 ring-1 ring-inset ring-slate-300/50 h-full">
              <div className="rounded-xl bg-white ring-1 ring-indigo-900/5 h-full">
                <div className="relative rounded-t-xl bg-slate-100 h-full">
                  <Link
                    href={`/blog/${study.link}`}
                    target="_blank"
                    className="h-full block"
                  >
                    <div
                      className={classNames(
                        "rounded-lg relative overflow-hidden h-full",
                        study.bgStyle,
                        "hover:cursor-pointer duration-300",
                      )}
                    >
                      <div className="relative z-10 h-full flex flex-col bg-white">
                        <div
                          className={classNames(
                            "border-b border-slate-200 py-12 md:py-20 px-8 flex justify-between",
                            study.imageBgStyle,
                          )}
                        >
                          <div className="mx-auto">
                            <study.logo />
                          </div>
                        </div>
                        <div className="px-8 py-6">
                          <p className="text-lg font-semibold tracking-tight text-gray-900 transition-all md:text-xl">
                            {study.metric}
                            {study.unit} {study.description}
                          </p>
                          <p className="mt-2 text-gray-600">{study.title}</p>
                          <Button
                            className={classNames(
                              "group mt-4 bg-transparent hover:bg-transparent px-0 text-indigo-600 justify-start",
                            )}
                            variant="light"
                          >
                            Read Story
                            <ArrowAnimated
                              className="stroke-indigo-600"
                              aria-hidden="true"
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
