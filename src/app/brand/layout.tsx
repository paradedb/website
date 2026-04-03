import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Assets",
  description:
    "Download ParadeDB logos and brand assets for use in your content.",
  alternates: { canonical: "/brand" },
};

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
