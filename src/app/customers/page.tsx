import { ContentListHeader } from "@/components/ContentListHeader";
import { getCaseStudyLinks } from "@/lib/blog";
import { siteConfig } from "../siteConfig";
import Link from "next/link";
import CustomerListImage from "./CustomerListImage";

export default async function Customers() {
  const caseStudies = await getCaseStudyLinks();

  return (
    <div className="w-full">
      <ContentListHeader
        title="Customers"
        subtitle="See how companies use ParadeDB to power search in Postgres."
      />

      <div className="md:py-12 px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {caseStudies.map((post) => (
            <Link
              key={post.href}
              href={`${siteConfig.baseLinks.customers}/${post.href}`}
              className="group"
            >
              <div className="bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors duration-200 overflow-hidden h-full flex flex-col border border-slate-200 dark:border-slate-800 rounded-lg">
                <div className="relative w-full aspect-video">
                  <CustomerListImage slug={post.href} title={post.name} />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-3 flex items-center justify-between">
                    <time className="text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 mb-2">
                    {post.name}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400 text-md md:text-sm leading-relaxed mb-4 flex-grow">
                    {post.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-sm md:text-xs text-gray-700 dark:text-slate-300">
                      By{" "}
                      {Array.isArray(post.author)
                        ? post.author.join(", ")
                        : post.author}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
