#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const contentDir = path.join(process.cwd(), "src/content/resources");
const resourcePagesDir = path.join(process.cwd(), "src/app/resources");
const publicResourcesDir = path.join(process.cwd(), "public/resources");

// Template for individual resource page
const pageTemplate = (slug, heroImageImport) => `"use client";

import { AuthorSection } from "@/components/AuthorSection";
import { HeroImage } from "@/components/HeroImage";
import { Title } from "@/components/Title";
import TableOfContents from "@/components/TableOfContents";

// Import the MDX content directly
import ResourceContent from "@/content/resources/${slug}/index.mdx";

// Import metadata
import resourceMetadata from "@/content/resources/${slug}/metadata.json";

${heroImageImport}

export default function ResourcePage() {
  return (
    <>
      <article className="prose w-full max-w-3xl">
        <Title metadata={resourceMetadata} />
        <AuthorSection metadata={resourceMetadata} />
        <HeroImage metadata={resourceMetadata} ${heroImageImport ? `src={heroImage}` : ""} />
        <ResourceContent />
      </article>
      <TableOfContents />
    </>
  );
}
`;

// Clean up existing individual resource pages
function cleanupExistingPages() {
  if (fs.existsSync(resourcePagesDir)) {
    const items = fs.readdirSync(resourcePagesDir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(resourcePagesDir, item.name);

      // Remove existing individual resource pages (but keep layout files)
      if (item.isDirectory() && !item.name.startsWith("_") && !item.name.endsWith(".tsx")) {
        fs.rmSync(itemPath, { recursive: true, force: true });
        console.log(`Removed existing resource page: ${item.name}`);
      }
    }
  }
}

// Copy resource images to public directory
function copyResourceImages() {
  // Ensure public/resources directory exists
  fs.mkdirSync(publicResourcesDir, { recursive: true });

  console.log("📸 Copying resource images to public directory...");

  if (!fs.existsSync(contentDir)) {
    return;
  }

  const sectionDirectories = fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  let imagesCopied = 0;

  for (const sectionName of sectionDirectories) {
    const sectionPath = path.join(contentDir, sectionName);
    
    const resourceDirectories = fs
      .readdirSync(sectionPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const resourceSlug of resourceDirectories) {
      const resourcePath = path.join(sectionPath, resourceSlug);
      const imagesDir = path.join(resourcePath, "images");
      const fullSlug = `${sectionName}/${resourceSlug}`;

      if (!fs.existsSync(imagesDir)) {
        continue;
      }

      // Create nested slug-specific directory in public/resources/
      const slugPublicDir = path.join(publicResourcesDir, fullSlug);
      fs.mkdirSync(slugPublicDir, { recursive: true });

      const imageFiles = fs.readdirSync(imagesDir);

      for (const imageFile of imageFiles) {
        const sourcePath = path.join(imagesDir, imageFile);

        // Keep author headshots in main public/blog/ directory for sharing
        if (
          imageFile.endsWith("_headshot.png") ||
          imageFile.endsWith("_headshot.jpeg") ||
          imageFile.endsWith("_headshot.jpg")
        ) {
          const destPath = path.join(process.cwd(), "public/blog", imageFile);
          fs.copyFileSync(sourcePath, destPath);
        } else {
          // Other images go to nested slug-specific directory
          const destPath = path.join(slugPublicDir, imageFile);
          fs.copyFileSync(sourcePath, destPath);
        }

        imagesCopied++;
      }

      console.log(`📸 Copied images for ${fullSlug}`);
    }
  }

  console.log(`📸 Copied ${imagesCopied} resource images to public/resources/`);
}

// Validate all images for a resource
function validateResourceImages(slug, resourceDir, mdxPath) {
  const errors = [];
  const warnings = [];
  const imagesDir = path.join(resourceDir, "images");

  // Read metadata to check if hero image is disabled
  const metadataPath = path.join(resourceDir, "metadata.json");
  let hideHeroImage = false;

  if (fs.existsSync(metadataPath)) {
    try {
      const metadataContents = fs.readFileSync(metadataPath, "utf8");
      const metadata = JSON.parse(metadataContents);
      hideHeroImage = metadata.hideHeroImage;
    } catch (err) {
      warnings.push(`Could not parse metadata for ${slug}: ${err.message}`);
    }
  }

  // 1. Check hero image exists (skip if hideHeroImage is true)
  if (!hideHeroImage) {
    const heroSvg = path.join(imagesDir, "hero.svg");
    const heroPng = path.join(imagesDir, "hero.png");
    if (!fs.existsSync(heroSvg) && !fs.existsSync(heroPng)) {
      errors.push(`Missing hero image (hero.svg or hero.png) for ${slug}`);
    }
  }

  // 2. Check OG image exists
  const ogImage = path.join(imagesDir, "opengraph-image.png");
  if (!fs.existsSync(ogImage)) {
    warnings.push(`Missing opengraph-image.png for ${slug}`);
  }

  // 3. Check Twitter image exists
  const twitterImage = path.join(imagesDir, "twitter-image.png");
  if (!fs.existsSync(twitterImage)) {
    warnings.push(`Missing twitter-image.png for ${slug}`);
  }

  // 4. Check all images referenced in MDX exist
  if (fs.existsSync(mdxPath)) {
    try {
      const mdxContent = fs.readFileSync(mdxPath, "utf8");

      // Find import statements for images
      const importRegex = /import\s+\w+\s+from\s+['"](\.\/images\/[^'"]+)['"]/g;
      let match;

      while ((match = importRegex.exec(mdxContent)) !== null) {
        const imagePath = match[1]; // e.g., "./images/hero.svg"
        const fullImagePath = path.join(resourceDir, imagePath);

        if (!fs.existsSync(fullImagePath)) {
          errors.push(
            `Missing image file: ${imagePath} referenced in ${slug}/index.mdx`,
          );
        }
      }

      // Also check for direct image references like ![alt](/resources/slug/image.png)
      const mdImageRegex = /!\[[^\]]*\]\(\/resources\/([^)]+)\)/g;
      while ((match = mdImageRegex.exec(mdxContent)) !== null) {
        const imagePath = match[1]; // e.g., "slug/hero.svg"
        const fullImagePath = path.join(publicResourcesDir, imagePath);

        if (!fs.existsSync(fullImagePath)) {
          errors.push(
            `Missing public image: /resources/${imagePath} referenced in ${slug}/index.mdx`,
          );
        }
      }
    } catch (err) {
      warnings.push(`Could not read MDX file for ${slug}: ${err.message}`);
    }
  }

  return { errors, warnings };
}

// Generate individual pages for each resource
function generateResourcePages() {
  if (!fs.existsSync(contentDir)) {
    console.log('ℹ️  No resources directory found, skipping resource generation');
    return;
  }

  const sectionDirectories = fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  let totalResources = 0;
  let totalErrors = [];
  let totalWarnings = [];

  // Count total resources
  for (const sectionName of sectionDirectories) {
    const sectionPath = path.join(contentDir, sectionName);
    const resourceDirectories = fs
      .readdirSync(sectionPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory());
    totalResources += resourceDirectories.length;
  }

  console.log(`Found ${totalResources} resources in ${sectionDirectories.length} sections`);

  if (totalResources === 0) {
    console.log('ℹ️  No resources found, skipping resource generation');
    return;
  }

  for (const sectionName of sectionDirectories) {
    const sectionPath = path.join(contentDir, sectionName);
    
    const resourceDirectories = fs
      .readdirSync(sectionPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const resourceSlug of resourceDirectories) {
      const resourceDir = path.join(sectionPath, resourceSlug);
      const metadataPath = path.join(resourceDir, "metadata.json");
      const mdxPath = path.join(resourceDir, "index.mdx");
      const fullSlug = `${sectionName}/${resourceSlug}`;

      // Check if both metadata.json and index.mdx exist
      if (!fs.existsSync(metadataPath) || !fs.existsSync(mdxPath)) {
        console.warn(`⚠️  Skipping ${fullSlug}: missing metadata.json or index.mdx`);
        continue;
      }

      // Validate metadata.json is valid JSON
      try {
        const metadataContents = fs.readFileSync(metadataPath, "utf8");
        const metadata = JSON.parse(metadataContents);

        // Validate required fields (note: section is no longer required as it's inferred from directory)
        if (!metadata.title) {
          totalErrors.push(
            `Missing required field 'title' in ${fullSlug}/metadata.json`,
          );
        }
        if (!metadata.date) {
          totalErrors.push(
            `Missing required field 'date' in ${fullSlug}/metadata.json`,
          );
        }
        if (!metadata.author) {
          totalErrors.push(
            `Missing required field 'author' in ${fullSlug}/metadata.json`,
          );
        }
        if (!metadata.description) {
          totalErrors.push(
            `Missing required field 'description' in ${fullSlug}/metadata.json`,
          );
        }
        if (!metadata.type) {
          totalErrors.push(
            `Missing required field 'type' in ${fullSlug}/metadata.json`,
          );
        }

        // Validate date format
        if (metadata.date && isNaN(new Date(metadata.date).getTime())) {
          totalErrors.push(
            `Invalid date format in ${fullSlug}/metadata.json: ${metadata.date}`,
          );
        }
      } catch (err) {
        totalErrors.push(`Invalid JSON in ${fullSlug}/metadata.json: ${err.message}`);
        continue; // Skip this resource if JSON is invalid
      }

      // Validate all images for this resource
      const { errors, warnings } = validateResourceImages(fullSlug, resourceDir, mdxPath);
      totalErrors.push(...errors);
      totalWarnings.push(...warnings);

      // Check for hero image and create import statement
      const imagesDir = path.join(resourceDir, "images");
      const heroSvg = path.join(imagesDir, "hero.svg");
      const heroPng = path.join(imagesDir, "hero.png");

      let heroImageImport = "";
      if (fs.existsSync(heroSvg)) {
        heroImageImport = `// Import hero image\nimport heroImage from "@/content/resources/${fullSlug}/images/hero.svg";`;
      } else if (fs.existsSync(heroPng)) {
        heroImageImport = `// Import hero image\nimport heroImage from "@/content/resources/${fullSlug}/images/hero.png";`;
      }

      // Create the page directory (nested structure: section/resource)
      const pageDir = path.join(resourcePagesDir, fullSlug);
      fs.mkdirSync(pageDir, { recursive: true });

      // Generate the page.tsx file
      const pageContent = pageTemplate(fullSlug, heroImageImport);
      const pagePath = path.join(pageDir, "page.tsx");

      fs.writeFileSync(pagePath, pageContent);
      console.log(`✅ Generated resource page: ${fullSlug}`);
    }
  }

  // Report validation results
  if (totalWarnings.length > 0) {
    console.log("\n⚠️  Resource Warnings:");
    totalWarnings.forEach((warning) => console.log(`  - ${warning}`));
  }

  if (totalErrors.length > 0) {
    console.log("\n❌ Resource Errors:");
    totalErrors.forEach((error) => console.log(`  - ${error}`));
    console.log(
      `\n💥 Build failed: ${totalErrors.length} resource validation error(s)`,
    );
    process.exit(1);
  }

  console.log(`✅ Generated ${totalResources} individual resource pages`);
  console.log(`✅ All resource images validated successfully!`);
}

// Main execution
function main() {
  console.log("🚀 Generating resource pages and assets...");

  cleanupExistingPages();
  copyResourceImages();
  generateResourcePages();

  console.log("✨ Resource generation complete!");
}

if (require.main === module) {
  main();
}

module.exports = { generateResourcePages, cleanupExistingPages, copyResourceImages };