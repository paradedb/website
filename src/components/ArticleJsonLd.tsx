import { JsonLd } from "@/components/JsonLd";
import { getArticleStructuredData } from "@/lib/structured-data";

/**
 * Server component that emits Article + BreadcrumbList JSON-LD for a content
 * page. Pass the post's `__dirname` from its layout.tsx.
 */
export function ArticleJsonLd({ dirPath }: { dirPath: string }) {
  const data = getArticleStructuredData(dirPath);
  if (!data) return null;
  return <JsonLd data={data} />;
}
