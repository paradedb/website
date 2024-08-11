import {
  RiFlashlightLine,
  RiGitForkLine,
  RiMenuSearchLine,
  RiScissorsCutLine,
  RiShieldCheckLine,
  RiSwap2Line,
} from "@remixicon/react"
import { Badge } from "../Badge"

const benefits = [
  {
    title: "Simplify your data stack",
    description:
      "Eliminate complex sync tools like ETL, Kafka, and Debezium. With ParadeDB, you can just write Postgres queries.",
    icon: RiGitForkLine,
    color: "indigo",
  },
  {
    title: "Zero data loss",
    description:
      "Never lose data again because of a broken sync with Elastic. ParadeDB uses native Postgres indexes that always stay sync.",
    icon: RiShieldCheckLine,
    color: "blue",
  },
  {
    title: "Real time search",
    description:
      "Postgres ACID transactions guarantee that data is searchable immediately after a successful write.",
    icon: RiMenuSearchLine,
    color: "green",
  },
  {
    title: "Automatic cleanup",
    description:
      "Never worry about cleaning up stale Elastic indexes. ParadeDB search indexes integrate with Postgres' vacuum process.",
    icon: RiScissorsCutLine,
    color: "rose",
  },
  {
    title: "Reliable data store",
    description:
      "Backups, high availability, and disaster recovery are all built into Postgres.",
    icon: RiSwap2Line,
    color: "orange",
  },
  {
    title: "State-of-the-art performance",
    description:
      "ParadeDB significantly outperforms Postgres native full text search and can query billions of rows in milliseconds.",
    icon: RiFlashlightLine,
    color: "yellow",
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
        Craft search experiences
        <br />
        <span className="bg-indigo-100 text-indigo-600">without</span> wrangling
        infra
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
