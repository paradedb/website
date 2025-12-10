// src/components/mdx/Callouts.tsx
import type { ReactNode } from "react";
import { Callout } from "@mintlify/components";

type CalloutProps = {
  children: ReactNode;
};

export function Info({ children }: CalloutProps) {
  return <Callout variant="info">{children}</Callout>;
}

export function Note({ children }: CalloutProps) {
  return <Callout variant="note">{children}</Callout>;
}
