# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ParadeDB marketing website built with Next.js 16 (App Router), MDX for content, and Tailwind CSS v4. Contains a blog, "Learn" educational section, and marketing pages.

## Commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Dev server at localhost:3000
pnpm run build        # Production build + sitemap generation
pnpm run lint         # ESLint
prettier --check "src/**/*.{ts,tsx}"  # Format check (CI runs this)
```

## Architecture

### Content System

Blog posts and learn resources are file-based MDX. Each piece of content lives in its own directory with a standard structure:

```text
src/app/blog/<slug>/
├── index.mdx           # Content (supports React components via MDX)
├── metadata.json       # title, date, author, description, categories
├── layout.tsx          # Generates metadata via generateBlogMetadata(__dirname)
├── page.tsx            # "use client" wrapper with MarkdownWrapper
└── images/             # hero.png, opengraph-image.png, twitter-image.png
```

Learn resources follow the same pattern under `src/app/learn/<section>/<slug>/`.

The `layout.tsx` and `page.tsx` files are boilerplate — every post uses the same pattern. The `metadata.json` is the source of truth for post metadata.

### Key Modules

- `src/lib/blog.ts` — Blog post loading (getAllPosts, getPostBySlug, getAllSlugs, getBlogLinks)
- `src/lib/resources.ts` — Learn resource loading, grouped by section (Search Concepts, Search In PostgreSQL, Tantivy)
- `src/lib/authors.ts` — Author registry (name + headshot). Author names in metadata.json must match keys here.
- `src/lib/blog-metadata.ts` — Generates Next.js Metadata objects from metadata.json + OG images
- `mdx-components.tsx` — Root-level MDX component mapping (H1-H3, P, Ul, Bold, CustomLink, charts, changelog components)
- `next.config.mjs` — MDX plugin setup (remark-gfm, remark-math, rehype-highlight, rehype-katex, rehype-slug) and URL redirects

### Component Organization

- `src/components/ui/` — Page-level marketing components (Hero, Pricing, Navbar, Footer, etc.)
- `src/components/mdx/` — MDX-specific components (Callout, custom headings/links)
- `src/components/charts/` — BarChartCard, LineChartCard (used in MDX content)

### Path Aliases

- `@/*` → `./src/*`
- `@markdown/*` → `./src/app/markdown/*`

## Conventions

- **Prettier**: Double quotes (`"singleQuote": false`)
- **TypeScript**: Strict mode, no unused variables/parameters
- **Styling**: Tailwind utility classes only (no CSS modules). Dark mode via class-based `next-themes`.
- **Package manager**: pnpm
- **Default branch**: `main`

## CI Checks (on PRs)

- Prettier formatting on `src/**/*.{ts,tsx}`
- Markdown linting on `**/*.{md,mdx}` (fenced code blocks must have a language specifier)
- Line ending validation (no CRLF), trailing whitespace, file-ending newlines
- Typo checking (codespell)
- YAML linting
