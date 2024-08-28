import {
  RiBracesLine,
  RiScissorsCutLine,
  RiShakeHandsLine,
  RiShieldCheckLine,
  RiStackLine,
  RiSwap2Line,
} from "@remixicon/react"
import { Badge } from "../Badge"

const benefits = [
  {
    title: "Reduced overhead",
    description:
      "Eliminate complex sync tools like ETL, Kafka, and Debezium. With ParadeDB, you can just use Postgres.",
    icon: RiStackLine,
  },
  {
    title: "Zero data loss",
    description:
      "Never lose data again because of a broken sync with Elastic. ParadeDB uses native Postgres indexes that always stay up to date.",
    icon: RiShieldCheckLine,
  },
  {
    title: "ACID guarantees",
    description:
      "Postgres ACID transactions guarantee that data is searchable immediately after a successful write.",
    icon: RiShakeHandsLine,
  },
  {
    title: "Automatic cleanup",
    description:
      "Never worry about cleaning up stale Elastic indexes. ParadeDB search indexes integrate with Postgres' vacuum process.",
    icon: RiScissorsCutLine,
  },
  {
    title: "Reliable data store",
    description:
      "First class support for backups, high availability and disaster recovery through Postgres.",
    icon: RiSwap2Line,
  },
  {
    title: "Postgres dialect",
    description:
      "Write queries using Postgres SQL. No need to wrangle with an unfamiliar query language.",
    icon: RiBracesLine,
  },
]

export default function Benefits() {
  return (
    <section
      aria-labelledby="code-example-title"
      className="mx-auto mt-28 w-full max-w-6xl px-3"
    >
      <Badge>Benefits</Badge>
      <h2 className="mt-2 inline-block bg-clip-text py-2 text-4xl font-bold tracking-tighter text-gray-900 sm:text-6xl md:text-6xl">
        Simplify and{" "}
        <span className="bg-indigo-100 text-indigo-600">strengthen</span> <br />{" "}
        your data stack
      </h2>
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
  )
}
