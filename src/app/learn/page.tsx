import { getResourceLinks } from "@/lib/resources";
import { siteConfig } from "../siteConfig";
import Link from "next/link";

export default async function Resources() {
  const allResources = await getResourceLinks();
  
  // Get the 3 most recently updated resources
  const recentResources = allResources
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  // Show resources landing page with cards
  return (
    <div className="mx-auto max-w-6xl px-6 md:mt">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Learn
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Deep dive into search concepts, learn how to build powerful search features in Postgres, and master search database fundamentals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentResources.map((resource) => (
          <Link
            key={resource.href}
            href={`${siteConfig.baseLinks.resources}/${resource.href}`}
            className="group"
          >
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 h-full">
              <div className="flex items-start justify-between mb-3">
                <time className="text-sm text-gray-500">
                  {new Date(resource.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 mb-2">
                {resource.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {resource.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
