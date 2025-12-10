/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";
import path from "path";

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
      // --- specific post renames ---
      {
        source: "/blog/introducing_lakehouse",
        destination: "https://www.paradedb.com/blog/introducing-search",
        permanent: true,
      },
      {
        source: "/blog/introducing_analytics",
        destination: "https://www.paradedb.com/blog/introducing-search",
        permanent: true,
      },
      {
        source: "/blog/block_storage_part_one",
        destination: "https://www.paradedb.com/blog/block-storage-part-one",
        permanent: true,
      },
      {
        source: "/blog/case_study_alibaba",
        destination: "https://www.paradedb.com/blog/case-study-alibaba",
        permanent: true,
      },
      {
        source: "/blog/case_study_bilt",
        destination: "https://www.paradedb.com/blog/case-study-bilt",
        permanent: true,
      },
      {
        source: "/blog/case_study_insa",
        destination: "https://www.paradedb.com/blog/case-study-insa",
        permanent: true,
      },
      {
        source: "/blog/case_study_sweetspot",
        destination: "https://www.paradedb.com/blog/case-study-sweetspot",
        permanent: true,
      },
      {
        source: "/blog/elasticsearch_vs_postgres",
        destination: "https://www.paradedb.com/blog/elasticsearch-vs-postgres",
        permanent: true,
      },
      {
        source: "/blog/etl_vs_logical_replication",
        destination: "https://www.paradedb.com/blog/etl-vs-logical-replication",
        permanent: true,
      },
      {
        source: "/blog/introducing_paradedb",
        destination: "https://www.paradedb.com/blog/introducing-paradedb",
        permanent: true,
      },
      {
        source: "/blog/introducing_search",
        destination: "https://www.paradedb.com/blog/introducing-search",
        permanent: true,
      },
      {
        source: "/blog/introducing_sparse",
        destination: "https://www.paradedb.com/blog/introducing-sparse",
        permanent: true,
      },
      {
        source: "/blog/lsm_trees_in_postgres",
        destination: "https://www.paradedb.com/blog/lsm-trees-in-postgres",
        permanent: true,
      },
      {
        source: "/blog/series_a_announcement",
        destination: "https://www.paradedb.com/blog/series-a-announcement",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    providerImportSource: "@mdx-js/react",
    remarkPlugins: [
      [
        "remark-math",
        {
          singleDollarTextMath: false,
          inlineMathDouble: true,
          blockMathDouble: true,
        },
      ],
      "remark-gfm",
    ],
    rehypePlugins: ["rehype-slug", "rehype-highlight", "rehype-katex"],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
