import type { Metadata } from "next";
import { generateContentMetadata } from "./content-metadata";
import { sep } from "path";

export function generateBlogMetadata(dirPath: string): Metadata {
  const blogIndex = dirPath.lastIndexOf(`${sep}blog${sep}`);
  const learnIndex = dirPath.lastIndexOf(`${sep}learn${sep}`);

  const contentType = learnIndex > blogIndex ? "learn" : "blog";

  return generateContentMetadata(dirPath, contentType);
}
