import Link from "next/link";
import type { Metadata } from "next";
import { ACTIVE_LANDING, landings } from "@/landings";

// Keep preview pages out of search engines.
export const metadata: Metadata = {
  title: "Landing page previews",
  robots: { index: false, follow: false },
};

export default function PreviewIndex() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Landing page variants
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Preview each variant below. The live homepage currently serves{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-sm dark:bg-slate-800">
          {ACTIVE_LANDING}
        </code>
        .
      </p>
      <ul className="mt-8 space-y-5">
        {Object.values(landings).map((landing) => (
          <li key={landing.key}>
            <Link
              href={`/preview/${landing.key}`}
              className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              {landing.name}
              {landing.key === ACTIVE_LANDING ? " (live)" : ""}
            </Link>
            {landing.description ? (
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                {landing.description}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
