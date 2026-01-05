import { documentation } from "@/lib/links";
import Link from "next/link";
import { Badge } from "../Badge";
import { Button } from "../Button";
import AnalyticsImage from "./AnalyticsImage";
import { ArrowAnimated } from "./ArrowAnimated";
import SearchImage from "./SearchImage";

export default function SearchAnalytics() {
  return (
    <section
      aria-labelledby="code-example-title"
      className="mx-auto mt-28 w-full max-w-6xl px-3"
    >
      <Badge>Product</Badge>
      <h2 className="mt-2 inline-block bg-clip-text py-2 text-4xl font-bold tracking-tighter text-gray-900 sm:text-6xl md:text-6xl">
        Legacy search is
        <br />
        holding you back
      </h2>
      <p className="mt-2 max-w-2xl text-gray-600 md:mt-6 md:text-lg">
        ParadeDB brings Elastic-quality search capabilities and analytical
        performance to Postgres.
      </p>
      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-4">
        <div
          className="relative col-span-2 mx-auto h-max max-w-2xl animate-slide-up-fade rounded-2xl md:hover:shadow-xl md:hover:shadow-indigo-200 sm:ml-auto sm:w-full md:col-span-1 duration-300"
          style={{ animationDuration: "1400ms" }}
        >
          <div className="rounded-2xl bg-indigo-50 p-2 ring-1 ring-inset ring-slate-300/50">
            <div className="rounded-xl bg-white ring-1 ring-indigo-900/5">
              <div className="relative rounded-t-xl bg-indigo-100">
                {/* <div className="absolute inset-0"></div> */}
                <SearchImage className="max-h-72 w-full px-8 pt-8" />
              </div>
              <div className="border-t border-indigo-900/5 px-8 py-6">
                <p className="text-lg font-semibold tracking-tight text-gray-900 transition-all md:text-xl">
                  Search
                </p>
                <p className="mt-2 text-gray-600">
                  Supercharge Postgres&apos; search capabilities with BM25
                  scoring, custom tokenizers, hybrid search, and more.{" "}
                </p>
                <Link href={documentation.SEARCH} target="_blank">
                  <Button
                    className="group mt-4 bg-transparent px-0 text-indigo-600 hover:bg-transparent"
                    variant="light"
                  >
                    Read Docs
                    <ArrowAnimated
                      className="stroke-indigo-600"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div
          className="relative col-span-2 mx-auto h-max max-w-2xl animate-slide-up-fade rounded-2xl md:hover:shadow-xl md:hover:shadow-indigo-200 sm:ml-auto sm:w-full md:col-span-1 duration-300"
          style={{ animationDuration: "1400ms" }}
        >
          <div className="rounded-2xl bg-indigo-50 p-2 ring-1 ring-inset ring-slate-300/50">
            <div className="rounded-xl bg-white ring-1 ring-indigo-900/5">
              <div className="relative rounded-t-xl bg-indigo-400">
                <AnalyticsImage className="max-h-72 w-full px-8 pt-8" />
              </div>
              <div className="border-t border-indigo-900/5 px-8 py-6">
                <p className="text-lg font-semibold tracking-tight text-gray-900 transition-all md:text-xl">
                  Analytics
                </p>
                <p className="mt-2 text-gray-600">
                  Enrich your search results with support for fast analytics and
                  faceting.
                </p>
                <Link href={documentation.ANALYTICS} target="_blank">
                  <Button
                    className="group mt-4 bg-transparent px-0 text-indigo-600 hover:bg-transparent"
                    variant="light"
                  >
                    Read Docs
                    <ArrowAnimated
                      className="stroke-indigo-600"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
