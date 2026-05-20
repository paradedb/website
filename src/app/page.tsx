import { ACTIVE_LANDING, landings } from "@/landings";

// To swap the live homepage, change ACTIVE_LANDING in src/landings/index.ts.
export default function Home() {
  const { Component } = landings[ACTIVE_LANDING];
  return <Component />;
}
