/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";
import path from "path";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  async redirects() {
    return [
      // --- host-based redirects (put first) ---
      {
        source: "/",
        has: [{ type: "host", value: "blog.paradedb.com" }],
        destination: "https://www.paradedb.com/blog",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "blog.paradedb.com" }],
        destination: "https://www.paradedb.com/blog/:path*",
        permanent: true,
      },
      // --- legacy legal page redirects ---
      {
        source: "/privacy",
        destination: "/legal/privacy",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/legal/terms",
        permanent: true,
      },
      // --- specific post renames ---
      {
        source: "/blog/introducing_lakehouse",
        destination: "/blog/introducing-search",
        permanent: true,
      },
      {
        source: "/blog/introducing_analytics",
        destination: "/blog/introducing-search",
        permanent: true,
      },
      {
        source: "/blog/block_storage_part_one",
        destination: "/blog/block-storage-part-one",
        permanent: true,
      },
      {
        source: "/blog/case_study_alibaba",
        destination: "/customers/case-study-alibaba",
        permanent: true,
      },
      {
        source: "/blog/case_study_bilt",
        destination: "/customers/case-study-bilt",
        permanent: true,
      },
      {
        source: "/blog/case_study_insa",
        destination: "/customers/case-study-insa",
        permanent: true,
      },
      {
        source: "/blog/case_study_sweetspot",
        destination: "/customers/case-study-sweetspot",
        permanent: true,
      },
      // Redirect old /blog/case-study-* URLs to /customers/case-study-*
      {
        source: "/blog/case-study-alibaba",
        destination: "/customers/case-study-alibaba",
        permanent: true,
      },
      {
        source: "/blog/case-study-bilt",
        destination: "/customers/case-study-bilt",
        permanent: true,
      },
      {
        source: "/blog/case-study-insa",
        destination: "/customers/case-study-insa",
        permanent: true,
      },
      {
        source: "/blog/case-study-sweetspot",
        destination: "/customers/case-study-sweetspot",
        permanent: true,
      },
      {
        source: "/blog/elasticsearch_vs_postgres",
        destination: "/blog/elasticsearch-vs-postgres",
        permanent: true,
      },
      {
        source: "/blog/etl_vs_logical_replication",
        destination: "/blog/etl-vs-logical-replication",
        permanent: true,
      },
      {
        source: "/blog/introducing_paradedb",
        destination: "/blog/introducing-paradedb",
        permanent: true,
      },
      {
        source: "/blog/introducing_search",
        destination: "/blog/introducing-search",
        permanent: true,
      },
      {
        source: "/blog/introducing_sparse",
        destination: "/blog/introducing-sparse",
        permanent: true,
      },
      {
        source: "/blog/lsm_trees_in_postgres",
        destination: "/blog/lsm-trees-in-postgres",
        permanent: true,
      },
      {
        source: "/blog/series_a_announcement",
        destination: "/blog/series-a-announcement",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
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
