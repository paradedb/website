"use client";

import { blog } from "@/lib/links";
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
    logo: () => <Bilt fill="white" className="h-5 md:h-6" />,
    link: blog.find((b) => b.href === "case_study_bilt")?.href,
    bgStyle: "bg-slate-50",
    textStyle: "text-gray-600 rounded-2xl py-1 px-3 border border-slate-200",
    title: "Bilt Reduces Postgres Query Timeouts by 95% with ParadeDB",
    hoverColor: "rgba(255,255,255,0.2)",
  },
  {
    metric: 5,
    unit: "x",
    description: "Read Throughput",
    logo: () => <Alibaba fill="black" className="h-5 md:h-6" />,
    link: blog.find((b) => b.href === "case_study_alibaba")?.href,
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
        Battled-Tested in Production
      </h2>
      <p className="mt-2 max-w-2xl text-gray-600 md:mt-6 md:text-lg">
        ParadeDB powers search and analytics for some of the most demanding
        enterprise applications.
      </p>
      <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4 items-stretch">
        {caseStudies.map((study, index) => (
          <div
            key={index}
            className="relative col-span-2 mx-auto h-full max-w-2xl animate-slide-up-fade rounded-2xl hover:shadow-xl hover:shadow-indigo-200 sm:ml-auto sm:w-full md:col-span-1 duration-300"
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
                      <div className="relative z-10 h-full flex flex-col">
                        <div className="border-b border-slate-200 py-4 md:py-6 px-8 flex justify-between">
                          <div>
                            <study.logo />
                          </div>
                          <div
                            className={classNames(
                              study.textStyle,
                              "text-sm flex space-x-2 hidden md:flex",
                            )}
                          >
                            <div className="bg-emerald-500 rounded-full w-2 h-2 relative top-1.5"></div>
                            <div>
                              {study.metric}
                              {study.unit} {study.description}
                            </div>
                          </div>
                        </div>
                        <div className="text-lg md:text-2xl px-8 mt-8 md:mt-12 font-semibold flex-1">
                          {study.title}
                        </div>
                        <Button
                          className={classNames(
                            "group mt-6 md:mt-12 bg-transparent hover:bg-transparent px-0 text-indigo-600 px-8 pb-8 justify-start",
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
