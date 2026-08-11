// Shared list of all "vs"-style comparison pages.
// Adding a new comparison: create src/app/vs/<slug>/page.tsx and add the entry here.
export const VS_COMPETITORS = [
  { slug: "postgresql", name: "Postgres" },
] as const;

export type CompetitorSlug = (typeof VS_COMPETITORS)[number]["slug"];
