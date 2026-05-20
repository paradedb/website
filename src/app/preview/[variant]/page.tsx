import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLanding, landings } from "@/landings";

// Keep preview pages out of search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Pre-render a preview page for every registered variant.
export function generateStaticParams() {
  return Object.keys(landings).map((variant) => ({ variant }));
}

export default async function PreviewVariant({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  const landing = getLanding(variant);
  if (!landing) notFound();

  const { Component } = landing;
  return <Component />;
}
