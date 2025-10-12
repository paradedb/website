import { redirect } from "next/navigation";
import { getAllPosts } from "@/lib/blog";

export default async function BlogPage() {
  const posts = await getAllPosts();
  
  if (posts.length > 0) {
    // Redirect to the most recent blog post
    redirect(`/blog/${posts[0].slug}`);
  }
  
  return <div>No blog posts found</div>;
}