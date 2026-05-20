# Landing pages

Swappable homepage variants. The homepage (`src/app/page.tsx`) renders whichever
variant `ACTIVE_LANDING` points to. Each variant is also previewable at its own
URL without touching the live site.

## Swap the live homepage

Edit one value in [`index.ts`](./index.ts):

```ts
export const ACTIVE_LANDING: LandingKey = "variant-b";
```

Commit and redeploy. That's it.

## Preview without going live

- `/preview` — index of every variant (the live one is marked).
- `/preview/<key>` — renders that variant directly (e.g. `/preview/variant-b`).

Preview pages are `noindex` and excluded from the sitemap, so they won't be
picked up by search engines. They are safe to share.

## Add a new variant

1. Create `src/landings/my-variant.tsx` exporting a default component that
   returns the full page (including its own `<main>` wrapper). Copy
   [`default.tsx`](./default.tsx) as a starting point.
2. Register it in [`index.ts`](./index.ts):

   ```ts
   import MyVariant from "./my-variant";

   export const landings = {
     // ...existing entries
     "my-variant": {
       key: "my-variant",
       name: "My Variant",
       description: "What this one is testing.",
       Component: MyVariant,
     },
   } satisfies Record<string, Landing>;
   ```

3. Preview it at `/preview/my-variant`. When ready, set `ACTIVE_LANDING` to
   `"my-variant"`.

Variants reuse the section components in `src/components/ui/`, so you can mix,
reorder, and drop sections freely.
