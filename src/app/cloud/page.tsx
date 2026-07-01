import type { Metadata } from "next";
import CloudWaitlist from "@/components/ui/CloudWaitlist";
import { DarkModeOverlay } from "@/components/ui/DarkModeOverlay";
import AsciiCloud from "@/components/ui/AsciiCloud";

export const metadata: Metadata = {
  title: "ParadeDB Cloud — Join the waitlist",
  description:
    "ParadeDB Cloud is fully managed Postgres with full-text search, vector retrieval, and analytics built in. Join the waitlist for early access.",
  alternates: { canonical: "/cloud" },
  openGraph: {
    title: "ParadeDB Cloud — Join the waitlist",
    description:
      "Fully managed ParadeDB. Join the waitlist for early access to ParadeDB Cloud.",
    url: "/cloud",
    type: "website",
  },
};

export default function CloudPage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col bg-indigo-600">
      {/* Subtle dark-mode tint, matching the homepage hero */}
      <DarkModeOverlay />

      {/* Full-bleed drifting dither behind everything, fading out to the sides */}
      <AsciiCloud />

      <section className="relative mx-auto flex w-full max-w-[1440px] flex-1 items-center px-4 md:px-12">
        <div className="relative z-20 mx-auto flex w-full flex-col items-center px-6 py-20 text-center sm:px-0 sm:py-32">
          <span className="mb-5 inline-flex items-center border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-50">
            Coming soon
          </span>
          <h1 className="py-2 text-4xl font-bold tracking-tighter text-white sm:text-6xl">
            ParadeDB Cloud
          </h1>
          <p className="mt-4 max-w-2xl text-base text-indigo-50 sm:text-lg">
            We&apos;re building a fully managed ParadeDB: one Postgres for your
            application data, full-text search, vector retrieval, and
            aggregations.
          </p>

          <div className="mt-8 w-full">
            <CloudWaitlist />
          </div>

          <p className="mt-4 text-xs text-indigo-200">
            No spam. We&apos;ll only email you about ParadeDB Cloud.
          </p>
        </div>
      </section>
    </main>
  );
}
