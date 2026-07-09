import type { Metadata } from "next";
import CloudWaitlist from "@/components/ui/CloudWaitlist";
import CloudShell from "@/components/ui/CloudShell";

export const metadata: Metadata = {
  title: "ParadeDB Cloud — Join the waitlist",
  description:
    "ParadeDB Cloud is fully managed Postgres with production-grade full-text search, vector retrieval, and aggregations built in. Join the waitlist for early access.",
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
    <CloudShell>
      <span className="mb-5 inline-flex items-center border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-50">
        Coming soon
      </span>
      <h1 className="py-2 text-4xl font-bold tracking-tighter text-white sm:text-6xl">
        ParadeDB Cloud
      </h1>
      <p className="mt-4 max-w-2xl text-base text-indigo-50 sm:text-lg">
        We&apos;re building a fully managed ParadeDB: one Postgres for your
        application data, full-text search, vector retrieval, and aggregations.
      </p>

      <div className="mt-8 w-full">
        <CloudWaitlist />
      </div>

      <p className="mt-4 text-xs text-indigo-200">
        No spam. We&apos;ll only email you about ParadeDB Cloud. You&apos;ll get
        one confirmation email, click it and you&apos;re in.
      </p>
    </CloudShell>
  );
}
