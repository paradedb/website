"use client";

import { Button } from "@/components/Button";
import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import { BlogLink } from "@/lib/blog";
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

export default function BlogLayoutClient({
  children,
  blogLinks,
}: {
  children: React.ReactNode;
  blogLinks: BlogLink[];
}) {
  const pathname = usePathname();
  const isBlogIndex = pathname === siteConfig.baseLinks.blog;
  const currentPageIdx = blogLinks.findIndex((item) =>
    pathname.endsWith(item.href),
  );
  const canGoBackward = !isBlogIndex && currentPageIdx > 0;
  const canGoForward = !isBlogIndex && currentPageIdx < blogLinks.length - 1;
  const nextHref = canGoForward
    ? `${siteConfig.baseLinks.blog}/${blogLinks[currentPageIdx + 1].href}`
    : "";
  const previousHref = canGoBackward
    ? `${siteConfig.baseLinks.blog}/${blogLinks[currentPageIdx - 1].href}`
    : "";

  return (
    <div className="mx-auto flex max-w-6xl md:mt-12">
      {!isBlogIndex && (
        <div className="hidden lg:flex lg:w-96 lg:flex-col">
          {/* Sidebar component */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {blogLinks.map((item) => (
                      <li key={item.href}>
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
      )}

      {/* Blog content */}
      <main className="w-full px-6 py-4 md:py-0">
        <div className="mx-auto flex justify-between">
          <div>{canGoBackward && <BackButton href={previousHref} />}</div>
          <div>{canGoForward && <NextButton href={nextHref} />}</div>
        </div>
        <div className="w-full py-4">{children}</div>
        <div className="mx-auto flex justify-between">
          <div>{canGoBackward && <BackButton href={previousHref} />}</div>
          <div>{canGoForward && <NextButton href={nextHref} />}</div>
        </div>
      </main>
    </div>
  );
}
