import { getBlogLinks } from "@/lib/blog";
import ContentList from "@/components/ContentList";

export default async function Blog() {
  const blogPosts = await getBlogLinks();

  return (
    <ContentList
      items={blogPosts}
      contentType="blog"
      title="Latest Posts"
      showImage={true}
      showCategory={true}
    />
  );
}
