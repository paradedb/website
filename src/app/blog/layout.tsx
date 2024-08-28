"use client"

import { Button } from "@/components/Button"
import { ArrowAnimated } from "@/components/ui/ArrowAnimated"
import classNames from "classnames"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { siteConfig } from "../siteConfig"

const navigation = [
  { name: "Why We Picked AGPL", href: "agpl", current: true },
  {
    name: "Full Text Search over Postgres: Elasticsearch vs. Alternatives",
    href: "elasticsearch_vs_postgres",
  },
  {
    name: "Querying Apache Iceberg from Postgres",
    href: "iceberg_lakehouse",
  },
  {
    name: "Case Study: Sweetspot Unifies Hybrid Search on Postgres with ParadeDB",
    href: "case_study_sweetspot",
  },
  {
    name: "Building a DuckDB Alternative in Postgres",
    href: "introducing_lakehouse",
  },
  {
    name: "Similarity Search with SPLADE Inside Postgres",
    href: "introducing_sparse",
  },
  {
    name: "pg_search: Elastic-Quality Full Text Search Inside Postgres",
    href: "introducing_search",
  },
  {
    name: "Introducing ParadeDB",
    href: "introducing_paradedb",
  },
]

const BackButton = ({ href }: { href: string }) => (
  <Link href={href}>
    <Button
      className="group bg-transparent px-0 text-gray-600 hover:bg-transparent"
      variant="light"
    >
      <ArrowAnimated
        className="relative right-3 rotate-180 transform stroke-gray-600"
        aria-hidden="true"
      />
      <div>Previous Post</div>
    </Button>
  </Link>
)

const NextButton = ({ href }: { href: string }) => (
  <Link href={href}>
    <Button
      className="group bg-transparent px-0 text-gray-600 hover:bg-transparent"
      variant="light"
    >
      Next Post
      <ArrowAnimated className="stroke-gray-600" aria-hidden="true" />
    </Button>
  </Link>
)

export default function BlogLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const currentPageIdx = navigation.findIndex((item) =>
    pathname.endsWith(item.href),
  )
  const canGoBackward = currentPageIdx > 0
  const canGoForward = currentPageIdx < navigation.length - 1
  const nextHref = canGoForward
    ? `${siteConfig.baseLinks.blog}/${navigation[currentPageIdx + 1].href}`
    : ""
  const previousHref = canGoBackward
    ? `${siteConfig.baseLinks.blog}/${navigation[currentPageIdx - 1].href}`
    : ""

  return (
    <>
      <div>
        <div className="mx-auto flex max-w-6xl md:mt-12">
          <div className="hidden lg:flex lg:w-96 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <a
                            href={`${siteConfig.baseLinks.blog}/${item.href}`}
                            className={classNames(
                              pathname.endsWith(item.href)
                                ? "bg-gray-50 text-indigo-600"
                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                            )}
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <main className="w-full px-4 py-4 md:py-0 lg:px-8">
            <div className="mx-auto flex justify-between">
              {canGoBackward && <BackButton href={previousHref} />}
              {canGoForward && <NextButton href={nextHref} />}
            </div>
            <div className="w-full py-4">{children}</div>
            <div className="mx-auto flex justify-between">
              {canGoBackward && <BackButton href={previousHref} />}
              {canGoForward && <NextButton href={nextHref} />}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
