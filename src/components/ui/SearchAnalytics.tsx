import { RiArrowRightSLine } from "@remixicon/react"
import { Badge } from "../Badge"
import { Button } from "../Button"
import AnalyticsImage from "./AnalyticsImage"
import SearchImage from "./SearchImage"

export default function SearchAnalytics() {
  return (
    <section
      aria-labelledby="code-example-title"
      className="mx-auto mt-28 w-full max-w-6xl px-3"
    >
      <Badge>Product</Badge>
      <h2
        id="code-example-title"
        className="mt-2 inline-block bg-clip-text py-2 text-4xl font-bold tracking-tighter text-gray-900 sm:text-6xl md:text-6xl"
      >
        Make Postgres as
        <br />
        <span className="bg-indigo-100 text-indigo-600">powerful</span> as
        Elastic
      </h2>
      <p className="mt-6 max-w-2xl text-lg text-gray-600">
        By transforming Postgres into a performant search and analytics
        database, <br />
        ParadeDB frees your team from the pain of scaling and syncing
        Elasticsearch.
      </p>
      <div className="flex h-fit space-x-6">
        <div
          className="relative mx-auto ml-3 mt-16 h-max max-w-2xl animate-slide-up-fade rounded-xl sm:ml-auto sm:w-full"
          style={{ animationDuration: "1400ms" }}
        >
          <div className="rounded-2xl bg-slate-50 p-2 ring-1 ring-inset ring-slate-300/50">
            <div className="rounded-xl bg-white ring-1 ring-indigo-900/5">
              <div className="relative rounded-t-xl bg-slate-100">
                {/* <div className="absolute inset-0"></div> */}
                <SearchImage className="w-full" />
              </div>
              <div className="border-t border-indigo-900/5 px-8 py-6">
                <p className="text-lg font-semibold tracking-tight text-gray-900 transition-all md:text-xl">
                  Search
                </p>
                <p className="mt-2 text-gray-600">
                  Build rich full text search experiences over Postgres data
                  with support for BM25 scoring, multi-language stemmers,
                  faceting, hybrid search, real-time consistency, and more.{" "}
                </p>
                <Button
                  className="mt-4 bg-transparent px-0 text-indigo-600 hover:bg-transparent"
                  variant="light"
                >
                  Read Docs
                  <span className="mr-1 flex size-6 items-center justify-center">
                    <RiArrowRightSLine
                      aria-hidden="true"
                      className="size-4 shrink-0 text-indigo-600"
                    />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="relative mx-auto ml-3 mt-16 h-max max-w-2xl animate-slide-up-fade rounded-xl sm:ml-auto sm:w-full"
          style={{ animationDuration: "1400ms" }}
        >
          <div className="rounded-2xl bg-slate-50 p-2 ring-1 ring-inset ring-slate-300/50">
            <div className="rounded-xl bg-white ring-1 ring-indigo-900/5">
              <div className="relative rounded-t-xl bg-indigo-500">
                <AnalyticsImage className="w-full" />
              </div>
              <div className="border-t border-indigo-900/5 px-8 py-6">
                <p className="text-lg font-semibold tracking-tight text-gray-900 transition-all md:text-xl">
                  Analytics
                </p>
                <p className="mt-2 text-gray-600">
                  Connect Postgres directly to cloud object stores for fast
                  analytical (OLAP) queries over any file or table format with
                  zero data movement.
                </p>
                <Button
                  className="mt-4 bg-transparent px-0 text-indigo-600 hover:bg-transparent"
                  variant="light"
                >
                  Read Docs
                  <span className="mr-1 flex size-6 items-center justify-center">
                    <RiArrowRightSLine
                      aria-hidden="true"
                      className="size-4 shrink-0 text-indigo-600"
                    />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
