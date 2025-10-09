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
    <div className="mx-auto max-w-6xl lg:px-6">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Learn</h1>
        <p className="text-lg text-gray-600 mb-6">
          Deep dive into search concepts, and learn how to build powerful search
          features in Postgres.
        </p>
      </div>

      {/* Desktop: Cards */}
      <div className="lg:block">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedResources.map((resource) => (
            <Link
              key={resource.href}
              href={`${siteConfig.baseLinks.resources}/${resource.href}`}
              className="group"
            >
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 h-full flex flex-col">
                <div className="mb-3">
                  <time className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(resource.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 mb-2">
                  {resource.name}
                </h3>
                <p className="text-gray-600 text-md md:text-sm leading-relaxed mb-4 flex-grow">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm md:text-xs text-indigo-500">
                    {resource.section}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
