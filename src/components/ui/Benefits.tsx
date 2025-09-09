import {
  RiBracesLine,
  RiMoneyDollarCircleLine,
  RiShakeHandsLine,
  RiShieldCheckLine,
  RiStackLine,
  RiSwap2Line,
} from "@remixicon/react";
import { Badge } from "../Badge";

const benefits = [
  {
    title: "ACID guarantees",
    description:
      "ACID transactions guarantee that data is searchable immediately after a successful write.",
    icon: RiShakeHandsLine,
  },
  {
    title: "Zero data loss",
    description:
      "Never lose data again because of a broken sync with Elastic. ParadeDB indexes always match your data.",
    icon: RiShieldCheckLine,
  },
  {
    title: "Reduced overhead",
    description:
      "Eliminate complex sync tools like ETL, Kafka, and Debezium. With ParadeDB your source of truth is also where you search.",
    icon: RiStackLine,
  },
  {
    title: "Optimized price-performance",
    description:
      "Elastic burns hardware. ParadeDB runs lean, written in Rust for efficiency without the cluster sprawl.",
    icon: RiMoneyDollarCircleLine,
  },
  {
    title: "Battle-tested",
    description:
      "First class support for backups, high availability, and disaster recovery through PostgreSQL's incredible ecosystem.",
    icon: RiSwap2Line,
  },
  {
    title: "Postgres dialect",
    description:
      "Write queries using Postgres SQL. No need to wrangle with an unfamiliar query language.",
    icon: RiBracesLine,
  },
];

export default function Benefits() {
  return (
    <section
      aria-labelledby="code-example-title"
      className="mx-auto mt-28 w-full max-w-6xl px-3"
    >
      <Badge>Benefits</Badge>
      <h2 className="mt-2 inline-block bg-clip-text py-2 text-4xl font-bold tracking-tighter text-gray-900 sm:text-6xl md:text-6xl">
        You need a<br />
        <span className="bg-indigo-100 text-indigo-600">
          search database
        </span>{" "}
        not a <br />
        search engine
      </h2>
      <p className="mt-2 max-w-2xl text-gray-600 md:mt-6 md:text-lg">
        ParadeDB is built on top of Postgres. It provides battle-tested
        reliability and consistency for the most demanding workloads, now with
        state-of-the-art full-text search. Goodbye sprawling out-of-sync Elastic
        clusters and missing shards.
      </p>
      <dl className="mt-8 grid grid-cols-3 gap-x-10 gap-y-8 sm:mt-12 sm:gap-y-10">
        {benefits.map((item, index) => (
          <div key={index} className="col-span-3 sm:col-span-1">
            <div className="w-fit rounded-lg bg-indigo-50 p-2.5 shadow-sm ring-1 ring-indigo-100">
              <item.icon
                aria-hidden="true"
                className="size-4 text-indigo-600 md:size-6"
              />
            </div>
            <dt className="mt-4 font-semibold text-gray-900 md:mt-6">
              {item.title}
            </dt>
            <dd className="mt-2 text-gray-600">{item.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
