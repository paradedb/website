import { getBlogLinks } from "@/lib/blog";
import { siteConfig } from "../siteConfig";
import Link from "next/link";
import BlogListImage from "./BlogListImage";

export default async function Blog() {
  const blogPosts = await getBlogLinks();

  return (
    <div className="mx-auto max-w-6xl lg:px-6">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Latest Posts
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Link
            key={post.href}
            href={`${siteConfig.baseLinks.blog}/${post.href}`}
            className="group"
          >
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full flex flex-col">
              <div className="relative w-full aspect-video">
                <BlogListImage slug={post.href} title={post.name} />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3 flex items-center justify-between">
                  <time className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  {post.categories && post.categories.length > 0 && (
                    <span className="text-xs text-indigo-500 rounded-lg bg-indigo-50 py-1 px-2 capitalize">
                      {post.categories[0]}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 mb-2">
                  {post.name}
                </h3>
                <p className="text-gray-600 text-md md:text-sm leading-relaxed mb-4 flex-grow">
                  {post.description}
                </p>
                <div className="mt-4">
                  <span className="text-sm md:text-xs text-gray-700">
                    By {Array.isArray(post.author)
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
  );
}
