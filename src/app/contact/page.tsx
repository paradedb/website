import type { Metadata } from "next";
import Link from "next/link";
import { email, github, social } from "@/lib/links";

export const metadata: Metadata = {
  title: "Contact ParadeDB",
  description:
    "Contact ParadeDB for sales, product support, security reports, community help, and open-source contributions.",
  alternates: { canonical: "/contact" },
};

const contactOptions = [
  {
    title: "Sales and partnerships",
    description:
      "Talk with us about production deployments, commercial support, partnerships, or ParadeDB Cloud.",
    label: "sales@paradedb.com",
    href: email.SALES,
  },
  {
    title: "Product support",
    description:
      "Get help with ParadeDB installation, configuration, upgrades, or an existing deployment.",
    label: "support@paradedb.com",
    href: email.SUPPORT,
  },
  {
    title: "Open-source development",
    description:
      "Report reproducible bugs, propose features, and contribute code in the ParadeDB GitHub repository.",
    label: "Open GitHub",
    href: github.REPO,
  },
  {
    title: "Community questions",
    description:
      "Ask implementation questions and connect with other people running search and analytics in Postgres.",
    label: "Join the Slack community",
    href: social.SLACK,
  },
];

export default function ContactPage() {
  return (
    <main className="relative w-full bg-white dark:bg-slate-950">
      <div className="relative mx-auto w-full max-w-[1440px] border-x border-slate-200 px-8 py-16 dark:border-slate-900 md:px-24 md:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Contact ParadeDB
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-indigo-950 dark:text-white sm:text-6xl">
            How can we help?
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            ParadeDB is the Postgres-native search and analytics engine behind
            the pg_search extension. Choose the route below that best matches
            your question so it reaches the right people. For general company
            questions that do not fit another category, email us at{" "}
            <Link
              className="text-indigo-600 hover:underline dark:text-indigo-400"
              href={email.HELLO}
            >
              hello@paradedb.com
            </Link>
            .
          </p>
        </div>

        <section aria-labelledby="contact-options" className="mt-14">
          <h2 id="contact-options" className="sr-only">
            Contact options
          </h2>
          <div className="grid gap-px border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 md:grid-cols-2">
            {contactOptions.map((option) => (
              <article
                key={option.title}
                className="bg-white p-8 dark:bg-slate-950"
              >
                <h3 className="text-xl font-semibold text-indigo-950 dark:text-white">
                  {option.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                  {option.description}
                </p>
                <Link
                  href={option.href}
                  className="mt-6 inline-flex font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  {option.label}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="security" className="mt-14 max-w-3xl">
          <h2
            id="security"
            className="text-2xl font-semibold text-indigo-950 dark:text-white"
          >
            Security reports
          </h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
            If you believe you found a security vulnerability, please avoid
            posting exploit details in a public issue. Send the report privately
            to{" "}
            <Link
              className="text-indigo-600 hover:underline dark:text-indigo-400"
              href={email.SECURITY}
            >
              security@paradedb.com
            </Link>{" "}
            with steps to reproduce and the affected version or service.
          </p>
        </section>
      </div>
    </main>
  );
}
