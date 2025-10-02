#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), 'src/content/blog');
const blogPagesDir = path.join(process.cwd(), 'src/app/blog');
const publicBlogDir = path.join(process.cwd(), 'public/blog');

// Template for individual blog page
const pageTemplate = (slug, heroImageImport) => `"use client";

import { AuthorSection } from "@/components/AuthorSection";
import { HeroImage } from "@/components/HeroImage";
import { Title } from "@/components/Title";
import TableOfContents from "@/components/TableOfContents";

// Import the MDX content directly
import BlogContent from "@/content/blog/${slug}/index.mdx";

// Import metadata
import blogMetadata from "@/content/blog/${slug}/metadata.json";

${heroImageImport}

export default function BlogPost() {
  return (
    <>
      <article className="prose w-full max-w-3xl">
        <Title metadata={blogMetadata} />
        <AuthorSection metadata={blogMetadata} />
        <HeroImage metadata={blogMetadata} ${heroImageImport ? `src={heroImage}` : ''} />
        <BlogContent />
      </article>
      <TableOfContents />
    </>
  );
}
`;

// Clean up existing individual blog pages and remove [slug] directory
function cleanupExistingPages() {
  if (fs.existsSync(blogPagesDir)) {
    const items = fs.readdirSync(blogPagesDir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(blogPagesDir, item.name);
      
      // Remove [slug] directory since we're not using dynamic routing anymore
      if (item.isDirectory() && item.name === '[slug]') {
        fs.rmSync(itemPath, { recursive: true, force: true });
        console.log(`Removed [slug] directory - no longer using dynamic routing`);
      }
      // Remove other existing individual blog pages
      else if (item.isDirectory() && !item.name.startsWith('_') && !item.name.endsWith('.tsx')) {
        fs.rmSync(itemPath, { recursive: true, force: true });
        console.log(`Removed existing page: ${item.name}`);
      }
    }
  }
}

// Copy blog images to public directory
function copyBlogImages() {
  // Ensure public/blog directory exists
  fs.mkdirSync(publicBlogDir, { recursive: true });
  
  console.log('📸 Copying blog images to public directory...');
  
  if (!fs.existsSync(contentDir)) {
    return;
  }

  const blogPosts = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  let imagesCopied = 0;

  for (const slug of blogPosts) {
    const imagesDir = path.join(contentDir, slug, 'images');
    
    if (!fs.existsSync(imagesDir)) {
      continue;
    }

    const imageFiles = fs.readdirSync(imagesDir);
    
    for (const imageFile of imageFiles) {
      const sourcePath = path.join(imagesDir, imageFile);
      const destPath = path.join(publicBlogDir, imageFile);
      
      // Copy image to public/blog/
      fs.copyFileSync(sourcePath, destPath);
      imagesCopied++;
    }

    // Special handling for hero images - also copy with slug naming for easier access
    const heroSvg = path.join(imagesDir, 'hero.svg');
    const heroPng = path.join(imagesDir, 'hero.png');
    
    if (fs.existsSync(heroSvg)) {
      fs.copyFileSync(heroSvg, path.join(publicBlogDir, `${slug}.svg`));
      console.log(`📸 Copied hero image: ${slug}.svg`);
    } else if (fs.existsSync(heroPng)) {
      fs.copyFileSync(heroPng, path.join(publicBlogDir, `${slug}.png`));
      console.log(`📸 Copied hero image: ${slug}.png`);
    }
  }

  console.log(`📸 Copied ${imagesCopied} blog images to public/blog/`);
}

// Validate all images for a blog post
function validateBlogImages(slug, postDir, mdxPath) {
  const errors = [];
  const warnings = [];
  const imagesDir = path.join(postDir, 'images');
  
  // Read metadata to check if hero image is disabled
  const metadataPath = path.join(postDir, 'metadata.json');
  let hideHeroImage = false;
  
  if (fs.existsSync(metadataPath)) {
    try {
      const metadataContents = fs.readFileSync(metadataPath, 'utf8');
      const metadata = JSON.parse(metadataContents);
      hideHeroImage = metadata.hideHeroImage;
    } catch (err) {
      warnings.push(`Could not parse metadata for ${slug}: ${err.message}`);
    }
  }
  
  // 1. Check hero image exists (skip if hideHeroImage is true)
  if (!hideHeroImage) {
    const heroSvg = path.join(imagesDir, 'hero.svg');
    const heroPng = path.join(imagesDir, 'hero.png');
    if (!fs.existsSync(heroSvg) && !fs.existsSync(heroPng)) {
      errors.push(`Missing hero image (hero.svg or hero.png) for ${slug}`);
    }
  }
  
  // 2. Check OG image exists
  const ogImage = path.join(imagesDir, 'opengraph-image.png');
  if (!fs.existsSync(ogImage)) {
    warnings.push(`Missing opengraph-image.png for ${slug}`);
  }
  
  // 3. Check Twitter image exists
  const twitterImage = path.join(imagesDir, 'twitter-image.png');
  if (!fs.existsSync(twitterImage)) {
    warnings.push(`Missing twitter-image.png for ${slug}`);
  }
  
  // 4. Headshot validation removed - handled by component logic
  
  // 5. Check all images referenced in MDX exist
  if (fs.existsSync(mdxPath)) {
    try {
      const mdxContent = fs.readFileSync(mdxPath, 'utf8');
      
      // Find import statements for images
      const importRegex = /import\s+\w+\s+from\s+['"](\.\/images\/[^'"]+)['"]/g;
      let match;
      
      while ((match = importRegex.exec(mdxContent)) !== null) {
        const imagePath = match[1]; // e.g., "./images/hero.svg"
        const fullImagePath = path.join(postDir, imagePath);
        
        if (!fs.existsSync(fullImagePath)) {
          errors.push(`Missing image file: ${imagePath} referenced in ${slug}/index.mdx`);
        }
      }
      
      // Also check for direct image references like ![alt](/blog/image.png)
      const mdImageRegex = /!\[[^\]]*\]\(\/blog\/([^)]+)\)/g;
      while ((match = mdImageRegex.exec(mdxContent)) !== null) {
        const imagePath = match[1]; // e.g., "hero.svg"
        const fullImagePath = path.join(publicBlogDir, imagePath);
        
        if (!fs.existsSync(fullImagePath)) {
          errors.push(`Missing public image: /blog/${imagePath} referenced in ${slug}/index.mdx`);
        }
      }
      
    } catch (err) {
      warnings.push(`Could not read MDX file for ${slug}: ${err.message}`);
    }
  }
  
  return { errors, warnings };
}

// Generate individual pages for each blog post
function generateBlogPages() {
  if (!fs.existsSync(contentDir)) {
    console.error('Content directory not found:', contentDir);
    process.exit(1);
  }

  const blogPosts = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Found ${blogPosts.length} blog posts`);

  let totalErrors = [];
  let totalWarnings = [];

  for (const slug of blogPosts) {
    const postDir = path.join(contentDir, slug);
    const metadataPath = path.join(postDir, 'metadata.json');
    const mdxPath = path.join(postDir, 'index.mdx');

    // Check if both metadata.json and index.mdx exist
    if (!fs.existsSync(metadataPath) || !fs.existsSync(mdxPath)) {
      console.warn(`⚠️  Skipping ${slug}: missing metadata.json or index.mdx`);
      continue;
    }

    // Validate metadata.json is valid JSON
    try {
      const metadataContents = fs.readFileSync(metadataPath, 'utf8');
      const metadata = JSON.parse(metadataContents);
      
      // Validate required fields
      if (!metadata.title) {
        totalErrors.push(`Missing required field 'title' in ${slug}/metadata.json`);
      }
      if (!metadata.date) {
        totalErrors.push(`Missing required field 'date' in ${slug}/metadata.json`);
      }
      if (!metadata.author) {
        totalErrors.push(`Missing required field 'author' in ${slug}/metadata.json`);
      }
      if (!metadata.description) {
        totalErrors.push(`Missing required field 'description' in ${slug}/metadata.json`);
      }
      
      // Validate date format
      if (metadata.date && isNaN(new Date(metadata.date).getTime())) {
        totalErrors.push(`Invalid date format in ${slug}/metadata.json: ${metadata.date}`);
      }
    } catch (err) {
      totalErrors.push(`Invalid JSON in ${slug}/metadata.json: ${err.message}`);
      continue; // Skip this post if JSON is invalid
    }

    // Validate all images for this post
    const { errors, warnings } = validateBlogImages(slug, postDir, mdxPath);
    totalErrors.push(...errors);
    totalWarnings.push(...warnings);

    // Check for hero image and create import statement
    const imagesDir = path.join(postDir, 'images');
    const heroSvg = path.join(imagesDir, 'hero.svg');
    const heroPng = path.join(imagesDir, 'hero.png');
    
    let heroImageImport = '';
    if (fs.existsSync(heroSvg)) {
      heroImageImport = `// Import hero image\nimport heroImage from "@/content/blog/${slug}/images/hero.svg";`;
    } else if (fs.existsSync(heroPng)) {
      heroImageImport = `// Import hero image\nimport heroImage from "@/content/blog/${slug}/images/hero.png";`;
    }

    // Create the page directory
    const pageDir = path.join(blogPagesDir, slug);
    fs.mkdirSync(pageDir, { recursive: true });

    // Generate the page.tsx file
    const pageContent = pageTemplate(slug, heroImageImport);
    const pagePath = path.join(pageDir, 'page.tsx');
    
    fs.writeFileSync(pagePath, pageContent);
    console.log(`✅ Generated page: ${slug}`);
  }

  // Report validation results
  if (totalWarnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    totalWarnings.forEach(warning => console.log(`  - ${warning}`));
  }

  if (totalErrors.length > 0) {
    console.log('\n❌ Errors:');
    totalErrors.forEach(error => console.log(`  - ${error}`));
    console.log(`\n💥 Build failed: ${totalErrors.length} image validation error(s)`);
    process.exit(1);
  }

  console.log(`✅ Generated ${blogPosts.length} individual blog pages`);
  console.log(`✅ All images validated successfully!`);
}

// Generate blog links for links.ts
function generateBlogLinks() {
  console.log('🔗 Generating blog links...');
  
  if (!fs.existsSync(contentDir)) {
    console.error('Content directory not found:', contentDir);
    return;
  }

  const blogPosts = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const links = [];

  for (const slug of blogPosts) {
    const postDir = path.join(contentDir, slug);
    const metadataPath = path.join(postDir, 'metadata.json');
    const mdxPath = path.join(postDir, 'index.mdx');

    // Only include posts with both metadata and content
    if (!fs.existsSync(metadataPath) || !fs.existsSync(mdxPath)) {
      continue;
    }

    try {
      const metadataContents = fs.readFileSync(metadataPath, 'utf8');
      const metadata = JSON.parse(metadataContents);
      
      // Handle both single author and array of authors
      const authorDisplay = Array.isArray(metadata.author) 
        ? metadata.author.join(', ')
        : metadata.author;

      links.push({
        name: metadata.title,
        href: slug,
        date: metadata.date,
        author: authorDisplay,
        description: metadata.description,
        categories: metadata.categories || []
      });
    } catch (err) {
      console.warn(`⚠️  Could not parse metadata for ${slug}: ${err.message}`);
    }
  }

  // Sort by date (newest first)
  links.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Generate the updated links.ts content
  const linksPath = path.join(process.cwd(), 'src/lib/links.ts');
  
  if (!fs.existsSync(linksPath)) {
    console.error('links.ts not found:', linksPath);
    return;
  }

  const currentContent = fs.readFileSync(linksPath, 'utf8');
  
  // Replace the blog export with the generated links
  const blogLinksCode = `// This is dynamically generated at build time
export const blog: Array<{
  name: string;
  href: string;
  date: string;
  author: string;
  description: string;
  categories?: string[];
}> = ${JSON.stringify(links, null, 2)};`;

  const updatedContent = currentContent.replace(
    /\/\/ This (?:will be|is) dynamically generated at build time\nexport const blog: Array<\{[^}]+\}> = (?:\[\]|[^;]+);/s,
    blogLinksCode
  );

  fs.writeFileSync(linksPath, updatedContent);
  console.log(`🔗 Generated ${links.length} blog links in links.ts`);
}

// Main execution
function main() {
  console.log('🚀 Generating blog pages and assets...');
  
  cleanupExistingPages();
  copyBlogImages();
  generateBlogPages();
  generateBlogLinks();
  
  console.log('✨ Blog generation complete!');
}

if (require.main === module) {
  main();
}

module.exports = { generateBlogPages, cleanupExistingPages, copyBlogImages, generateBlogLinks };
