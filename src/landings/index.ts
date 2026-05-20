import type { ComponentType } from "react";
import DefaultLanding from "./default";
import VariantBLanding from "./variant-b";

/**
 * A swappable landing page variant.
 */
export interface Landing {
  /** Stable URL-safe key. Used in preview URLs: /preview/<key>. */
  key: string;
  /** Human-friendly name shown on the /preview index. */
  name: string;
  /** Short note on what this variant is testing (optional). */
  description?: string;
  /** The full-page component, including its own <main> wrapper. */
  Component: ComponentType;
}

/**
 * All landing pages kept in the codebase. Add a new entry here to make a
 * variant previewable at /preview/<key> and selectable as the live homepage.
 */
export const landings = {
  default: {
    key: "default",
    name: "Default",
    description: "The current production homepage.",
    Component: DefaultLanding,
  },
  "variant-b": {
    key: "variant-b",
    name: "Variant B",
    description:
      "Example variant — social proof moved directly under the hero.",
    Component: VariantBLanding,
  },
} satisfies Record<string, Landing>;

export type LandingKey = keyof typeof landings;

/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  The landing page served at "/". Change this one value to swap the    │
 * │  live homepage, then commit and redeploy.                             │
 * └─────────────────────────────────────────────────────────────────────┘
 */
export const ACTIVE_LANDING: LandingKey = "default";

/** Look up a landing by key. Returns undefined for unknown keys. */
export function getLanding(key: string): Landing | undefined {
  return (landings as Record<string, Landing>)[key];
}
