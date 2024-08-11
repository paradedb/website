"use client"
import { Badge } from "../Badge"
import IntegrationsImage from "./IntegrationsImage"

const features = [
  {
    name: "RDS Compatible",
    description:
      "ParadeDB uses Postgres logical replication to integrate with RDS, Azure and Google Cloud Postgres.",
  },
  {
    name: "S3 Compatible",
    description:
      "Specialized Postgres foreign data wrappers can directly query and ingest data from S3, GCS, and Azure Blob Storage.",
  },
]

export default function Managed() {
  return (
    <div className="px-3">
      <section
        aria-labelledby="global-database-title"
        className="relative mx-auto mt-28 flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-3xl bg-slate-100 px-8 py-12 md:mt-40 md:px-24 md:py-24"
      >
        <Badge>ParadeDB Managed</Badge>
        <h2
          id="global-database-title"
          className="z-10 mt-6 inline-block px-2 text-center text-4xl font-bold tracking-tighter text-gray-900 md:text-6xl"
        >
          Say <span className="bg-indigo-100 text-indigo-600">goodbye</span> to
          ETL
        </h2>
        <p className="mt-6 max-w-2xl text-center text-gray-600 md:text-lg">
          ParadeDB Managed runs in your AWS, Azure, or GCP account and
          integrates with any Postgres or object store — with zero ETL or change
          data capture.
        </p>
        <div className="mt-8 w-full">
          <IntegrationsImage className="mx-auto w-full max-w-4xl" />
        </div>
        <div className="grid grid-cols-1 gap-x-10 gap-y-6 rounded-lg border border-white/[3%] bg-white/[1%] py-6 md:grid-cols-2 md:p-8 md:px-6">
          {features.map((item) => (
            <div key={item.name} className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-indigo-600 md:text-lg">
                {item.name}
              </h3>
              <p className="text-md leading-6 text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
