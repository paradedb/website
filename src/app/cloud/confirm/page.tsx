import type { Metadata } from "next";
import CloudShell from "@/components/ui/CloudShell";
import CloudConfirm from "@/components/ui/CloudConfirm";

export const metadata: Metadata = {
  title: "Confirm your email — ParadeDB Cloud",
  description: "Confirm your email to join the ParadeDB Cloud waitlist.",
  // The confirmation token arrives in this page's URL: never leak it via the
  // Referer header, and keep the page out of search indexes.
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default function CloudConfirmPage() {
  return (
    <CloudShell>
      <span className="mb-5 inline-flex items-center border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-50">
        One last step
      </span>
      <h1 className="py-2 text-4xl font-bold tracking-tighter text-white sm:text-6xl">
        Confirm your email
      </h1>

      <div className="mt-8 w-full">
        <CloudConfirm />
      </div>
    </CloudShell>
  );
}
