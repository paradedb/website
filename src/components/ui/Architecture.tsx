import Image from "next/image"
import Tantivy from "../../../public/tantivy-logo.png"
import DuckdbLogo from "./DuckdbLogo"
import PostgresLogo from "./PostgresLogo"
import PoweredByParade from "./PoweredByParade"

const TantivyLogo = () => (
  <Image
    src={Tantivy}
    alt="Tantivy, the fastest full-text search engine library written in Rust"
    height={26}
    width={26}
    className="h-4 w-4 sm:h-6 sm:w-6"
  />
)

const features = [
  {
    name: "Postgres",
    description:
      "ParadeDB is not a fork of Postgres, but 100% vanilla Postgres with our custom extensions installed.",
    icon: PostgresLogo,
  },
  {
    name: "Tantivy",
    description:
      "ParadeDB Search is built on Tantivy, a Rust-based alternative to the Lucene search engine library.",
    icon: TantivyLogo,
  },
  {
    name: "DuckDB",
    description:
      "ParadeDB Analytics is built on DuckDB, a column-oriented, in-process analytical database built for speed.",
    icon: DuckdbLogo,
  },
]

export default function Architecture() {
  return (
    <section
      aria-labelledby="code-example-title"
      className="mx-auto mt-28 w-full max-w-6xl px-3 md:mt-36"
    >
      <div className="w-full sm:text-center">
        <h2
          id="code-example-title"
          className="inline-block max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-center sm:text-6xl md:text-6xl"
        >
          Powered by{" "}
          <span className="bg-indigo-100 text-indigo-600">battle-tested</span>{" "}
          open source
        </h2>
      </div>
      <PoweredByParade className="mx-auto mt-6 hidden w-full max-w-6xl sm:block" />
      <dl className="mt-12 grid grid-cols-3 gap-12 sm:mt-0 sm:gap-6">
        {features.map((item) => (
          <div
            key={item.name}
            className="border-t-gradient col-span-full rounded-2xl sm:col-span-1 sm:bg-slate-50 sm:p-2 sm:ring-1 sm:ring-inset sm:ring-slate-300/50"
          >
            <div className="h-full bg-white sm:rounded-xl sm:px-6 sm:py-6 sm:ring-1 sm:ring-indigo-900/5">
              <div className="w-fit rounded-lg p-2.5 shadow-sm ring-1 ring-slate-200">
                <item.icon
                  aria-hidden="true"
                  className="size-4 text-gray-900 md:size-6"
                />
              </div>
              <dt className="mt-4 text-lg font-medium text-gray-900 md:mt-6">
                {item.name}
              </dt>
              <dd className="mt-2 text-gray-600">{item.description}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}
