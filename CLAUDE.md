# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ParadeDB marketing website built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. Deployed on Vercel.

## Commands

- **Dev server:** `pnpm dev` (runs on localhost:3000, uses webpack)
- **Build:** `pnpm build` (Next.js build + sitemap generation via next-sitemap)
- **Lint:** `pnpm lint` (ESLint with Next.js core-web-vitals and TypeScript rules)
- **Format:** `npx prettier --write <file>` (double quotes, Tailwind CSS plugin for class sorting)

No test framework is configured. CI runs lint-typescript, lint-markdown, lint-yaml, lint-format (whitespace/CRLF), and codespell checks.

## Architecture

### Content System (Blog & Learn)

Content lives directly in the App Router as MDX pages. Each piece of content follows this structure:

```
src/app/blog/[slug]/
├── metadata.json    # title, author, date, description, categories, image, canonical
├── index.mdx        # MDX content (imported by page.tsx)
├── page.tsx          # "use client" wrapper using MarkdownWrapper
├── layout.tsx        # Server component calling generateBlogMetadata()
└── images/           # opengraph-image.png, twitter-image.png
```

The `/learn` section mirrors this pattern nested under `src/app/learn/[section]/[resource]/`.

Key content utilities:
- `src/lib/blog.ts` — `getAllPosts()`, `getPostBySlug()`, `getAllSlugs()`, `getBlogLinks()`
- `src/lib/resources.ts` — Same pattern for learn section, with section grouping and ordering
- `src/lib/blog-metadata.ts` — `generateBlogMetadata()` used by both blog and learn layouts

### MDX Pipeline

Configured in `next.config.mjs` with:
- **Remark plugins:** remark-math (LaTeX), remark-gfm (tables, strikethrough)
- **Rehype plugins:** rehype-slug (heading anchors), rehype-highlight (syntax highlighting), rehype-katex (math rendering)

Custom MDX component mappings are in `src/mdx-components.tsx` — maps h1/h2/h3/p/ul/a to styled components and registers custom components (ChangelogEntry, ChangelogImage, chart cards).

### Component Layers

- `src/components/ui/` — Page sections and UI primitives (Navbar, Footer, Hero, Pricing, etc.). Uses Tremor for charts, Radix UI for accessible primitives, Remixicon for icons.
- `src/components/mdx/` — MDX-specific components (Callout, etc.)
- `src/components/blog/` — Blog listing and post components
- `src/components/charts/` — Recharts/Tremor chart wrappers

### Styling

Tailwind CSS v4 with `@tailwindcss/postcss`. Theme variables, animations, and custom utilities defined in `src/app/globals.css`. Dark mode via `next-themes` with system preference detection. Component variants use `tailwind-variants`.

### Path Aliases

- `@/*` → `./src/*`
- `@markdown/*` → `./src/app/markdown/*`

## Key Conventions

- Package manager is **pnpm**
- PR target branch is **dev**
- Prettier uses **double quotes**
- Routes use **kebab-case** (e.g., `search-concepts`, `hybrid-search`)
- Server components by default; `"use client"` only for interactive components
- Blog/learn page.tsx files are client components wrapping MDX; layout.tsx files are server components handling metadata
- Site config (name, URL, base links) centralized in `src/app/siteConfig.ts`
- External links and navigation defined in `src/lib/links.ts`
