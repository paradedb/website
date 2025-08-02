/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";
import rehypeHighlight from "rehype-highlight";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below

  async redirects() {
    return [
      // Subdomain redirect (from previous step)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'blog.paradedb.com',
          },
        ],
        destination: 'https://paradedb.com/blog/:path*',
        permanent: true,
      },
      // Redirect for old blog post: introducing_lakehouse
      {
        source: '/blog/introducing_lakehouse',
        destination: 'https://www.paradedb.com/blog/introducing_search',
        permanent: true, // Use 308 for permanent redirect, good for SEO
      },
      // Redirect for old blog post: introducing_analytics
      {
        source: '/blog/introducing_analytics',
        destination: 'https://www.paradedb.com/blog/introducing_search',
        permanent: true, // Use 308 for permanent redirect, good for SEO
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
    rehypePlugins: [rehypeHighlight],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
