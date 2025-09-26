import { blog } from "@/lib/links";
import { Metadata } from "next";
import Content from "./content";

const post = blog.find(
  (post) => post.href === "elasticsearch-acid-test",
);

export const metadata: Metadata = {
  title: post?.name,
  description: post?.description,
};

export default function Blog() {
  return (
    <div className="prose w-full max-w-3xl">
      <Content />
    </div>
  );
}
