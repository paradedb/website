import { getResourceLinks } from "@/lib/resources";
import { siteConfig } from "../siteConfig";
import Link from "next/link";

export default async function Resources() {
  const allResources = await getResourceLinks();

  // Sort all resources by date (most recent first)
  const sortedResources = allResources.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="w-full">
      <div className="relative border-b border-slate-200 dark:border-slate-900">
        <div className="pt-8 pb-10 md:py-12 px-6 md:px-12 relative">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Learn
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl">
            Deep dive into search concepts, and learn how to build powerful
            search features in Postgres.
          </p>
        </div>
      </div>

      <div className="md:py-12 px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sortedResources.map((resource) => (
            <Link
              key={resource.href}
              href={`${siteConfig.baseLinks.resources}/${resource.href}`}
              className="group"
            >
              <div className="bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors duration-200 overflow-hidden h-full flex flex-col border border-slate-200 dark:border-slate-800 rounded-none">
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-3 flex items-center justify-between">
                    <time className="text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(resource.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    <span className="text-xs text-indigo-500 bg-indigo-50 dark:bg-indigo-900/50 py-1 px-2 capitalize rounded-lg">
                      {resource.section}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 mb-2">
                    {resource.name}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400 text-md md:text-sm leading-relaxed mb-4 flex-grow">
                    {resource.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-sm md:text-xs text-gray-700 dark:text-slate-300 font-medium">
                      Topic:{" "}
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {resource.section}
                      </span>
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
