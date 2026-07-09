import type { Metadata } from "next";
import { RiCheckLine } from "@remixicon/react";
import CloudShell from "@/components/ui/CloudShell";

export const metadata: Metadata = {
  title: "You're on the list — ParadeDB Cloud",
  description: "Your spot on the ParadeDB Cloud waitlist is confirmed.",
  robots: { index: false, follow: false },
};

// Landing page for Waitlister's post-confirmation redirect (the double
// opt-in "redirect after confirmation" setting in the dashboard points here).
export default function CloudConfirmedPage() {
  return (
    <CloudShell>
      <span className="mb-5 inline-flex items-center border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-50">
        Confirmed
      </span>
      <h1 className="py-2 text-4xl font-bold tracking-tighter text-white sm:text-6xl">
        You&apos;re on the list
      </h1>
      <p className="mt-4 max-w-2xl text-base text-indigo-50 sm:text-lg">
        Your email is confirmed and your spot on the ParadeDB Cloud waitlist is
        locked in. We&apos;ll be in touch the moment early access opens.
      </p>

      <div className="mt-8 mx-auto flex max-w-md items-center justify-center gap-2.5 border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-medium text-white">
        <RiCheckLine className="size-5 shrink-0" />
        No further action needed — you can close this tab.
      </div>

      <p className="mt-6 text-sm text-indigo-200">
        You can find{" "}
        <a
          href="https://github.com/paradedb/paradedb"
          className="underline decoration-indigo-300 underline-offset-4 hover:text-white"
        >
          ParadeDB on GitHub
        </a>
        , or read the{" "}
        <a
          href="/blog"
          className="underline decoration-indigo-300 underline-offset-4 hover:text-white"
        >
          blog
        </a>{" "}
        to see what we&apos;re building.
      </p>
    </CloudShell>
  );
}
