"use client"

import { siteConfig } from "@/app/siteConfig"
import { cx } from "@/lib/utils"
import { RiCloseLine, RiGithubFill, RiMenuLine } from "@remixicon/react"
import Link from "next/link"
import React from "react"
import { DatabaseLogo } from "../../../public/DatabaseLogo"
import { Button } from "../Button"

const OWNER = "paradedb"
const REPO = "paradedb"
const GITHUB_API = `https://api.github.com/repos/${OWNER}/${REPO}`
const GITHUB_URL = `https://github.com/${OWNER}/${REPO}`

const formatStarCount = (count: number) => {
  if (count < 1000) {
    return count
  } else {
    return `${(count / 1000).toFixed(1)}K`
  }
}

export function Navigation() {
  const [stars, setStars] = React.useState()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery: MediaQueryList = window.matchMedia("(min-width: 768px)")
    const handleMediaQueryChange = () => {
      setOpen(false)
    }

    mediaQuery.addEventListener("change", handleMediaQueryChange)
    handleMediaQueryChange()

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange)
    }
  }, [])

  React.useEffect(() => {
    async function fetchStars() {
      try {
        const response = await fetch(GITHUB_API)
        if (response.ok) {
          const data = await response.json()
          setStars(data.stargazers_count)
        }
      } catch (error) {}
    }

    fetchStars()
  }, [])

  return (
    <header
      className={cx(
        "inset-x-3 z-50 mx-auto mt-4 flex max-w-6xl transform-gpu animate-slide-down-fade justify-center overflow-hidden rounded-xl border border-transparent px-3 py-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform md:mt-4",
        open === true ? "h-52" : "h-16",
        open === true
          ? "backdrop-blur-nav max-w-3xl border-gray-100 bg-white/80 shadow-xl shadow-black/5 dark:border-white/15 dark:bg-black/70"
          : "bg-white/0 dark:bg-gray-950/0",
      )}
    >
      <div className="w-full md:my-auto">
        <div className="relative flex items-center justify-between">
          <Link href={siteConfig.baseLinks.home} aria-label="Home">
            <span className="sr-only">Company logo</span>
            <DatabaseLogo className="w-28" />
          </Link>
          <nav className="hidden md:absolute md:left-1/2 md:top-1/2 md:block md:-translate-x-1/2 md:-translate-y-1/2 md:transform">
            <div className="flex items-center gap-6 text-sm font-medium">
              <Link
                className="px-2 py-1 text-indigo-900 hover:text-indigo-600"
                href={siteConfig.baseLinks.about}
              >
                Documentation
              </Link>
              <Link
                className="px-2 py-1 text-indigo-900 hover:text-indigo-600"
                href={siteConfig.baseLinks.pricing}
              >
                Blog
              </Link>
              <Link
                className="px-2 py-1 text-indigo-900 hover:text-indigo-600"
                href={siteConfig.baseLinks.changelog}
              >
                Community
              </Link>
            </div>
          </nav>
          <div className="flex items-center justify-center space-x-6">
            {stars && (
              <Link
                href={GITHUB_URL}
                target="_blank"
                className="flex items-center justify-center space-x-2"
              >
                <RiGithubFill
                  aria-hidden="true"
                  className="size-6 shrink-0 text-indigo-900"
                />
                <div className="text-sm font-medium text-indigo-900">
                  {formatStarCount(stars)}
                </div>
              </Link>
            )}
            <Button className="hidden rounded-full border-4 border-indigo-200 px-4 md:flex">
              <Link href="#">Book a Demo</Link>
            </Button>
          </div>
          <div className="flex gap-x-2 md:hidden">
            <Button className="rounded-full border-4 border-indigo-200 px-4">
              Book a Demo
            </Button>
            <Button
              onClick={() => setOpen(!open)}
              variant="light"
              className="aspect-square p-2"
            >
              {open ? (
                <RiCloseLine aria-hidden="true" className="size-5" />
              ) : (
                <RiMenuLine aria-hidden="true" className="size-5" />
              )}
            </Button>
          </div>
        </div>
        <nav
          className={cx(
            "my-6 flex text-lg ease-in-out will-change-transform md:hidden",
            open ? "" : "hidden",
          )}
        >
          <ul className="space-y-4 font-medium">
            <li onClick={() => setOpen(false)}>
              <Link href={siteConfig.baseLinks.about}>About</Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href={siteConfig.baseLinks.pricing}>Pricing</Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href={siteConfig.baseLinks.changelog}>Changelog</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
