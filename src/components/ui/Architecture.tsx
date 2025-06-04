import Image from "next/image";
import Tantivy from "../../../public/tantivy-logo.png";
import { Badge } from "../Badge";
import DuckdbLogo from "./DuckdbLogo";
import PostgresLogo from "./PostgresLogo";

const TantivyLogo = () => (
  <Image
    src={Tantivy}
    alt="Tantivy, the fastest full-text search engine library written in Rust"
    height={26}
    width={26}
    className="h-4 w-4 sm:h-6 sm:w-6"
  />
);

const features = [
  {
    name: "Postgres",
    description:
      "ParadeDB is not a fork of Postgres, but 100% vanilla Postgres with our extension installed.",
    icon: PostgresLogo,
  },
  {
    name: "Tantivy",
    description:
      "ParadeDB's search is built on Tantivy, a Rust-based alternative to the Lucene search engine library.",
    icon: TantivyLogo,
  },
  {
    name: "DuckDB",
    description:
      "DuckDB, an analytical database built for speed, powers ParadeDB's data lake integrations.",
    icon: DuckdbLogo,
  },
];

export default function Architecture() {
  return (
    <section
      aria-labelledby="code-example-title"
      className="mx-auto mt-28 w-full max-w-6xl px-3 md:mt-36"
    >
      <div className="w-full">
        <Badge>Architecture</Badge>
        <h2
          id="code-example-title"
          className="inline-block max-w-3xl bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl"
        >
          Powered by{" "}
          <span className="bg-indigo-100 text-indigo-600">battle-tested</span>,{" "}
          <br />
          production-grade tools
        </h2>
      </div>
      <dl className="mt-12 grid grid-cols-3 gap-12 md:mt-16">
        {features.map((item) => (
          <div key={item.name} className="col-span-full sm:col-span-1">
            <div className="w-fit rounded-lg p-2.5 shadow-sm ring-1 ring-slate-200">
              <item.icon
                aria-hidden="true"
                className="size-4 text-gray-900 md:size-6"
              />
            </div>
            <div className="mt-4 font-semibold text-gray-900 md:mt-6">
              {item.name}
            </div>
            <dd className="mt-2 text-gray-600">{item.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
