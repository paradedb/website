"use client"
import Balancer from "react-wrap-balancer"
import { Button } from "../Button"
import { Input } from "../Input"
import RadialBackground from "./RadialBackground"

export default function Cta() {
  return (
    <section
      aria-labelledby="cta-title"
      className="mx-auto mb-20 mt-32 max-w-6xl p-1 px-2 sm:mt-56"
    >
      <div className="relative flex items-center justify-center">
        <RadialBackground className="h-72 w-full md:h-96" />
        <div className="max-w-4xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div>
              <h3
                id="cta-title"
                className="inline-block bg-gradient-to-t from-gray-900 to-gray-800 bg-clip-text p-2 text-4xl font-bold tracking-tighter text-transparent md:text-6xl dark:from-gray-50 dark:to-gray-300"
              >
                Ready to get started?
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-gray-600 sm:text-lg dark:text-gray-400">
                <Balancer>
                  Start testing right away with our documentation or book a demo
                  with our sales team.
                </Balancer>
              </p>
            </div>
            <div className="mt-14 w-full rounded-[16px] bg-gray-300/5 p-1.5 ring-1 ring-black/[3%] backdrop-blur dark:bg-gray-900/10 dark:ring-white/[3%]">
              <div className="rounded-xl bg-white p-4 shadow-lg shadow-indigo-500/10 ring-1 ring-black/5 dark:bg-gray-950 dark:shadow-indigo-500/10 dark:ring-white/5">
                <form
                  className="flex flex-col items-center gap-3 sm:flex-row"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    id="email"
                    className="h-10 w-full min-w-0 flex-auto"
                    inputClassName="h-full"
                    placeholder="Your Work Email "
                  />
                  <Button
                    className="h-10 w-full sm:w-fit sm:flex-none"
                    type="submit"
                    variant="primary"
                  >
                    Get started
                  </Button>
                </form>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-600 sm:text-sm dark:text-gray-400">
              Have a quick question?{" "}
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-500 dark:hover:text-indigo-400"
              >
                Email us
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
