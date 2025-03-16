import Code from "@/components/Code"
import { ArrowAnimated } from "@/components/ui/ArrowAnimated"
import { documentation, social } from "@/lib/links"
import Link from "next/link"
import { Button } from "../Button"

const code = `docker run --name paradedb -e POSTGRES_PASSWORD=password paradedb/paradedb
docker exec -it paradedb psql -U postgres`

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="sm:pt-23 flex flex-col items-center justify-center bg-white px-4 pt-20 text-center"
    >
      <Link
        target="_blank"
        href="https://www.ubicloud.com/blog/elastic-quality-full-text-search-on-postgres"
      >
        <div className="group mx-auto flex cursor-pointer space-x-2 rounded-full bg-slate-50 px-4 py-2 text-xs text-indigo-950 ring ring-1 ring-slate-200">
          <div className="relative size-4">
            <div className="absolute inset-[1px] rounded-full bg-emerald-500/20" />
            <div className="absolute inset-1 rounded-full bg-emerald-600" />
          </div>
          <div>Announcing our partnership with Ubicloud</div>
          <ArrowAnimated
            className="relative top-1 h-2 w-2 stroke-indigo-900"
            aria-hidden="true"
          />
        </div>
      </Link>
      <h1
        id="hero-title"
        className="mt-4 inline-block animate-slide-up-fade bg-gradient-to-br from-indigo-900 to-indigo-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-indigo-900 text-transparent sm:text-6xl"
        style={{ animationDuration: "700ms" }}
      >
        Search and analytics <br /> for Postgres with{" "}
        <span className="text-indigo-600">zero ETL</span>
      </h1>
      <p
        className="text-md mt-2 max-w-xl animate-slide-up-fade text-indigo-900 md:mt-6 md:text-lg"
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
          <Link target="_blank" href={social.CALENDLY}>
            Book a Demo
          </Link>
        </Button>
        <Button
          asChild
          variant="light"
          className="text-md hover: group rounded-full bg-transparent hover:bg-transparent"
        >
          <Link
            href={documentation.BASE}
            className="text-indigo-900 ring-1 ring-gray-200 sm:ring-0"
            target="_blank"
          >
            Documentation
            <ArrowAnimated className="stroke-indigo-900" aria-hidden="true" />
          </Link>
        </Button>
      </div>
      <div
        className="relative mx-auto ml-3 mt-16 hidden h-fit w-[40rem] max-w-3xl animate-slide-up-fade sm:ml-auto sm:w-full sm:px-2 md:block"
        style={{ animationDuration: "1400ms" }}
      >
        <div className="rounded-2xl bg-slate-50 p-2 ring-1 ring-inset ring-slate-300/50">
          <div className="rounded-xl bg-white ring-1 ring-indigo-900/5">
            <Code
              code={code}
              lang="bash"
              copy={true}
              className="rounded-xl bg-slate-100 text-left"
              theme="github-dark-dimmed"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
