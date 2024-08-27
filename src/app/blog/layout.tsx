"use client"

import classNames from "classnames"
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

export default function BlogLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <>
      <div>
        <div className="mx-auto flex max-w-6xl md:mt-12">
          <div className="hidden lg:flex lg:w-72 lg:flex-col">
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

          <main>
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}
