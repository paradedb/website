import DuckdbLogo from "./DuckdbLogo"
import PostgresLogo from "./PostgresLogo"

const TantivyLogo = () => (
  <img
    src="https://tantivy-search.github.io/logo/tantivy-logo.png"
    alt="Tantivy, the fastest full-text search engine library written in Rust"
    height={26}
    width={26}
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
    name: "DuckDB",
    description:
      "DuckDB is a column-oriented, in-process analytical database built for speed.",
    icon: DuckdbLogo,
  },
  {
    name: "Tantivy",
    description:
      "Tantivy is a Rust-based alternative to the Lucene search engine library.",
    icon: TantivyLogo,
  },
]

export default function CodeExample() {
  return (
    <section
      aria-labelledby="code-example-title"
      className="mx-auto mt-28 w-full max-w-6xl px-3 md:mt-40"
    >
      <h2
        id="code-example-title"
        className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
      >
        And built on{" "}
        <span className="bg-rose-100 text-rose-600">battle-tested</span>
        <br />
        open source
      </h2>
      <dl className="mt-16 grid grid-cols-3 gap-12">
        {features.map((item) => (
          <div
            key={item.name}
            className="col-span-full sm:col-span-2 lg:col-span-1"
          >
            <div className="w-fit rounded-lg p-2.5 shadow-sm ring-1 ring-slate-200">
              <item.icon aria-hidden="true" className="size-6 text-gray-900" />
            </div>
            <dt className="mt-6 text-lg font-medium text-gray-900">
              {item.name}
            </dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">
              {item.description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
