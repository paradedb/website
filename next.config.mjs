/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below

  async redirects() {
    return [
      // --- host-based redirects (put first) ---
      {
        source: "/",
        has: [{ type: "host", value: "blog.paradedb.com" }],
        destination: "https://paradedb.com/blog",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "blog.paradedb.com" }],
        destination: "https://paradedb.com/blog/:path*",
        permanent: true,
      },
      // --- specific post renames ---
      {
        source: "/blog/introducing_lakehouse",
        destination: "https://www.paradedb.com/blog/introducing_search",
        permanent: true,
      },
      {
        source: "/blog/introducing_analytics",
        destination: "https://www.paradedb.com/blog/introducing_search",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  // Add any MDX-specific options or plugins here, if needed
  extension: /\.mdx?$/,
  options: {
    // You can add rehype/remark plugins here if desired
    providerImportSource: "@mdx-js/react",
    remarkPlugins: [
      [
        remarkMath,
        {
          singleDollarTextMath: false,
          inlineMathDouble: true,
          blockMathDouble: true,
        },
      ],
      remarkGfm,
    ],
    rehypePlugins: [rehypeSlug, rehypeHighlight, rehypeKatex],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
