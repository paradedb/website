import { RiGithubFill } from "@remixicon/react"
import { Badge } from "../Badge"
import DockerLogo from "./DockerLogo"
import PostgresLogo from "./PostgresLogo"

const features = [
  {
    metric: "40K+",
    name: "Docker deployments",
    description:
      "Our Docker image is the easiest way to test or self-manage ParadeDB.",
    icon: DockerLogo,
  },
  {
    metric: "10K+",
    name: "Postgres extension installs",
    description:
      "All our features are shipped as Postgres extensions, which means that ParadeDB can drop into any self-managed Postgres.",
    icon: PostgresLogo,
  },
  {
    metric: "5K+",
    name: "Stargazers on Github",
    description:
      "ParadeDB is one of the fastest-growing open source database projects.",
    icon: RiGithubFill,
  },
]

export default function OpenSource() {
  return (
    <section
      aria-labelledby="code-example-title"
      className="mx-auto mt-28 w-full max-w-6xl px-3"
    >
      <Badge>Open Source</Badge>
      <h2
        id="code-example-title"
        className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl"
      >
        Trusted by the community
      </h2>
      <p className="mt-2 max-w-2xl text-gray-600 md:mt-6 md:text-lg">
        ParadeDB has been deployed across thousands of production environments
        and is loved by developers.
      </p>
      <dl className="mt-12 grid grid-cols-3 gap-12 md:mt-16">
        {features.map((item) => (
          <div key={item.name} className="col-span-full sm:col-span-1">
            <div className="w-fit rounded-lg p-2.5 shadow-sm ring-1 ring-slate-200">
              <item.icon
                aria-hidden="true"
                className="size-4 text-gray-900 md:size-6"
              />
            </div>
            <div className="mt-4 w-fit rounded-lg text-2xl font-bold text-gray-900 md:mt-6 md:text-3xl">
              {item.metric}
            </div>
            <dt className="mt-1 font-medium text-gray-900 md:mt-2">
              {item.name}
            </dt>
            <dd className="mt-2 text-gray-600">{item.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
