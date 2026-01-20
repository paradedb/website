# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the official ParadeDB marketing and documentation website, built with Next.js 15 and hosted on Vercel. The site uses Tremor Raw components for UI and MDX for content.

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Tremor Raw, Radix UI, Headless UI
- **Content:** MDX (Markdown + JSX)
- **Package Manager:** pnpm (recommended)
- **Hosting:** Vercel
- **Fonts:** Next.js font optimization with Inter

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utility functions and helpers
└── styles/          # Global styles

public/              # Static assets
```

## Common Commands

### Development

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### Using npm (alternative)

If you prefer npm over pnpm, replace `pnpm` with `npm` in all commands:

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

## Development Workflow

### Adding New Pages

1. Create page in `src/app/<route>/page.tsx`
2. Use TypeScript for type safety
3. Follow App Router conventions
4. Add to sitemap configuration in `next-sitemap.config.js` if needed

### Adding MDX Content

1. Create `.mdx` file in appropriate location
2. Use frontmatter for metadata
3. Import and use React components as needed
4. Supported features:
   - Syntax highlighting (via `rehype-highlight`)
   - Math equations (via `rehype-katex` and `remark-math`)
   - GitHub Flavored Markdown (via `remark-gfm`)
   - Automatic heading slugs (via `rehype-slug`)

Example MDX file:

```mdx
---
title: "Page Title"
description: "Page description"
---

# Heading

Regular markdown content with **formatting**.

<CustomComponent />
```

### Styling

The project uses:

- **Tailwind CSS** for utility-first styling
- **Tremor Raw** components for data visualization and UI
- **Radix UI** primitives for accessible components
- **class-variance-authority** (cva) for component variants

```tsx
import { cn } from "@/lib/utils";

export function Component({ className }) {
  return <div className={cn("base-styles", className)}>Content</div>;
}
```

### Adding Components

1. Create component in `src/components/`
2. Use TypeScript interfaces for props
3. Export from component file
4. Import where needed

```tsx
// src/components/MyComponent.tsx
interface MyComponentProps {
  title: string;
  children: React.ReactNode;
}

export function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

## Configuration Files

- **`next.config.mjs`** - Next.js configuration
- **`tailwind.config.ts`** - Tailwind CSS configuration
- **`tsconfig.json`** - TypeScript configuration
- **`next-sitemap.config.js`** - Sitemap generation
- **`postcss.config.mjs`** - PostCSS configuration
- **`eslint.config.mjs`** - ESLint rules
- **`mdx-components.tsx`** - MDX component overrides

## Important Notes

### Next.js Font Optimization

The project uses `next/font` to automatically optimize and load Inter font. This is configured in the layout files.

### MDX Configuration

MDX is configured with:

- **rehype-highlight** - Syntax highlighting for code blocks
- **rehype-katex** - Math equation rendering
- **rehype-slug** - Automatic heading ID generation
- **remark-gfm** - GitHub Flavored Markdown support
- **remark-math** - Math syntax support

### Tremor Raw Components

Tremor Raw provides data visualization and dashboard components. Import from `@tremor/react`:

```tsx
import { Card, AreaChart, Title, Text } from "@tremor/react";
```

See [Tremor Raw documentation](https://raw.tremor.so/docs/getting-started/installation) for component usage.

## Building and Deployment

### Local Production Build

```bash
# Build
pnpm build

# Run production server locally
pnpm start
```

### Vercel Deployment

The site is configured for automatic deployment on Vercel:

1. Push to `main` branch triggers production deployment
2. Pull requests create preview deployments
3. Build settings are configured in Vercel dashboard

Build settings:

- Build command: `pnpm build`
- Output directory: `.next`
- Install command: `pnpm install`

## Sitemap Generation

Sitemap is automatically generated during build via `next-sitemap`:

```bash
# Build site and generate sitemap
pnpm build
```

Configuration in `next-sitemap.config.js` controls:

- Site URL
- Included/excluded routes
- Change frequency
- Priority settings

## Performance

### Image Optimization

Use Next.js `<Image>` component for automatic optimization:

```tsx
import Image from "next/image";

<Image src="/path/to/image.jpg" alt="Description" width={500} height={300} />;
```

### Code Splitting

Next.js automatically code-splits by route. For additional splitting:

```tsx
import dynamic from "next/dynamic";

const DynamicComponent = dynamic(() => import("./Component"));
```

## Troubleshooting

**Build fails with MDX errors:** Check MDX syntax and frontmatter formatting

**Tailwind styles not applying:** Verify class names and check `tailwind.config.ts` content paths

**Font loading issues:** Clear `.next` cache and rebuild

**Port 3000 already in use:** Change port with `pnpm dev -p 3001`

## Code Quality

### Linting

```bash
# Run ESLint
pnpm lint

# Auto-fix issues
pnpm lint --fix
```

### Type Checking

```bash
# TypeScript type checking
npx tsc --noEmit
```

### Formatting

The project uses Prettier for code formatting (configured in `.prettierrc` and `.prettierignore`).

## License

AGPL-3.0 with commercial licensing available
