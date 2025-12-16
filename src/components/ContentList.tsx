import { ContentLink } from "@/lib/content";
import { siteConfig } from "@/app/siteConfig";
import Link from "next/link";
import BlogListImage from "@/app/blog/BlogListImage";

interface ContentListProps {
  items: ContentLink[];
  contentType: "blog" | "learn";
  title: string;
  description?: string;
  showImage?: boolean;
  showCategory?: boolean;
  showType?: boolean;
  showSection?: boolean;
}

export default function ContentList({
  items,
  contentType,
  title,
  description,
  showImage = false,
  showCategory = false,
  showType = false,
  showSection = false,
}: ContentListProps) {
  const baseUrl =
    contentType === "learn"
      ? siteConfig.baseLinks.resources
      : siteConfig.baseLinks.blog;

  return (
    <div className="mx-auto max-w-6xl lg:px-6">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h1>
        {description && (
          <p className="text-lg text-gray-600 mb-6">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link
            key={item.href}
            href={`${baseUrl}/${item.href}`}
            className="group"
          >
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full flex flex-col">
              {showImage && contentType === "blog" && (
                <div className="relative w-full aspect-video">
                  <BlogListImage slug={item.href} title={item.name} />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3 flex items-center justify-between">
                  <time className="text-sm text-gray-500 whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  {showCategory &&
                    item.categories &&
                    item.categories.length > 0 && (
                      <span className="text-xs text-indigo-500 rounded-lg bg-indigo-50 py-1 px-2 capitalize">
                        {item.categories[0]}
                      </span>
                    )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-md md:text-sm leading-relaxed mb-4 flex-grow">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  {contentType === "blog" && (
                    <span className="text-sm md:text-xs text-gray-700">
                      By{" "}
                      {Array.isArray(item.author)
                        ? item.author.join(", ")
                        : item.author}
                    </span>
                  )}
                  {contentType === "learn" && (
                    <>
                      {showSection && item.section && (
                        <span className="text-sm md:text-xs text-indigo-500">
                          {item.section}
                        </span>
                      )}
                      {showType && item.type && (
                        <span className="text-sm md:text-xs text-gray-500 capitalize">
                          {item.type}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
