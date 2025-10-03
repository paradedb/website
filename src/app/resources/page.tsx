import { getResourceLinks } from "@/lib/resources";
import { siteConfig } from "../siteConfig";
import Link from "next/link";

export default async function Resources() {
  const allResources = await getResourceLinks();
  
  // Get the 3 most recently updated resources
  const recentResources = allResources
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  // If no resources, show empty state
  if (allResources.length === 0) {
    return (
      <div>
            <article className="prose">
              <h1 className="text-2xl font-bold normal-case tracking-tight text-gray-900">
                Resources
              </h1>
              <p className="text-gray-600">
                Resources and guides are coming soon. Check back later for tutorials, documentation, and helpful guides.
              </p>
              <div className="mt-8">
                <a
                  href={siteConfig.baseLinks.blog}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Visit our Blog
                </a>
              </div>
            </article>
      </div>
    );
  }

  // Show resources landing page with cards
  return (
    <div className="mx-auto max-w-6xl px-6 md:mt">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Resources
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Explore our collection of guides, tutorials, and documentation to help you get the most out of ParadeDB.
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                  {resource.type}
                </span>
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
              <div className="flex items-center text-sm text-gray-500">
                <span>By {resource.author}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
