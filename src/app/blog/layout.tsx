"use client";

import { Button } from "@/components/Button";
import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import { blog } from "@/lib/links";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "../siteConfig";

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
);

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
);

export default function BlogLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentPageIdx = blog.findIndex((item) => pathname.endsWith(item.href));
  const canGoBackward = currentPageIdx > 0;
  const canGoForward = currentPageIdx < blog.length - 1;
  const nextHref = canGoForward
    ? `${siteConfig.baseLinks.blog}/${blog[currentPageIdx + 1].href}`
    : "";
  const previousHref = canGoBackward
    ? `${siteConfig.baseLinks.blog}/${blog[currentPageIdx - 1].href}`
    : "";

  return (
    <div className="mx-auto flex max-w-6xl md:mt-12">
      <div className="hidden lg:flex lg:w-96 lg:flex-col">
        {/* Sidebar component */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {blog.map((item) => (
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

      {/* Blog content */}
      <main className="w-full px-6 py-4 md:py-0">
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
  );
}
