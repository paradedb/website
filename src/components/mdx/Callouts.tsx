// src/components/mdx/Callouts.tsx
import type { ReactNode } from "react";
import { Callout } from "@mintlify/components";

type CalloutProps = {
  children: ReactNode;
};

const baseClasses =
  // shape + spacing
  "!rounded-2xl !border !px-4 !py-3 " +
  // typography
  "text-[15px] leading-tight";

export function Info({ children }: CalloutProps) {
  return (
    <Callout variant="info" className={baseClasses}>
      {children}
    </Callout>
  );
}

export function Note({ children }: CalloutProps) {
  return (
    <Callout variant="note" className={baseClasses}>
      {children}
    </Callout>
  );
}
