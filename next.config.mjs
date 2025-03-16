/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";
import rehypeHighlight from "rehype-highlight";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
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
