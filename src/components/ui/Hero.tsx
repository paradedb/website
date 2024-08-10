import Code from "@/components/Code"
import { RiArrowRightSLine } from "@remixicon/react"
import Link from "next/link"
import { Button } from "../Button"

const code = `docker run --name paradedb -e POSTGRES_PASSWORD=password paradedb/paradedb
docker exec -it paradedb psql -U postgres`

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="sm:pt-23 flex flex-col items-center justify-center bg-white pt-20 text-center"
    >
      <h1
        id="hero-title"
        className="inline-block animate-slide-up-fade bg-gradient-to-br from-indigo-900 to-indigo-800 bg-clip-text p-2 text-4xl font-bold leading-loose tracking-tighter text-indigo-900 text-transparent sm:text-6xl"
        style={{ animationDuration: "700ms" }}
      >
        Search and analytics <br /> for Postgres with{" "}
        <span className="text-indigo-600">zero ETL</span>
      </h1>
      <p
        className="mt-6 max-w-xl animate-slide-up-fade text-lg text-indigo-900"
        style={{ animationDuration: "900ms" }}
      >
        ParadeDB is a modern Elasticsearch alternative built on Postgres. Built
        for real-time, update-heavy workloads.
      </p>
      <div
        className="mt-8 flex w-full animate-slide-up-fade flex-col justify-center gap-3 px-3 sm:flex-row"
        style={{ animationDuration: "1100ms" }}
      >
        <Button className="text-md rounded-full border-4 border-indigo-200 px-4">
          <Link href="#">Book a Demo</Link>
        </Button>
        <Button
          asChild
          variant="light"
          className="text-md hover: group bg-transparent hover:bg-transparent"
        >
          <Link
            href="https://www.youtube.com/watch?v=QRZ_l7cVzzU"
            className="text-indigo-900 ring-1 ring-gray-200 sm:ring-0"
            target="_blank"
          >
            Documentation
            <span className="mr-1 flex size-6 items-center justify-center">
              <RiArrowRightSLine
                aria-hidden="true"
                className="size-4 shrink-0 text-indigo-900"
              />
            </span>
          </Link>
        </Button>
      </div>
      <div
        className="relative mx-auto ml-3 mt-16 h-fit w-[40rem] max-w-3xl animate-slide-up-fade sm:ml-auto sm:w-full sm:px-2"
        style={{ animationDuration: "1400ms" }}
      >
        <div className="rounded-2xl bg-slate-50 p-2 ring-1 ring-inset ring-slate-300/50">
          <div className="rounded-xl bg-white ring-1 ring-indigo-900/5">
            <Code
              code={code}
              lang="bash"
              copy={true}
              className="rounded-xl bg-slate-100 text-left"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
