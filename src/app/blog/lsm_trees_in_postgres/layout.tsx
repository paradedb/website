import { Metadata } from "next";
import { blog } from "@/lib/links";

const post = blog.find((post) => post.href === "lsm_trees_in_postgres");

export const metadata: Metadata = {
    title: post?.name,
    description: post?.description,
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
