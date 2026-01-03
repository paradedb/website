"use client";

import { Badge } from "./Badge";
import { Button } from "../Button";
import Link from "next/link";
import { RiCheckLine } from "@remixicon/react";

const PricingCard = ({
  planName,
  description,
  features,
  buttonText,
  buttonLink,
  buttonVariant = "primary",
  badgeText,
}: {
  planName: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  buttonVariant?: "primary" | "secondary" | "light";
  badgeText: string;
}) => (
  <div className="flex flex-col p-8 md:p-12 h-full bg-white dark:bg-transparent text-left items-start">
    <div className="mb-8 w-full">
      <div className="flex justify-start mb-2">
        <Badge className="bg-slate-100/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-medium py-0.5 px-2 text-[10px] uppercase tracking-wider">
          {badgeText}
        </Badge>
      </div>
      <div className="flex items-baseline justify-start gap-1 mb-4">
        <span className="text-3xl font-bold text-indigo-950 dark:text-white">{planName}</span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>

    <ul className="space-y-4 mb-10 w-full text-left">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
          <RiCheckLine className="size-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="leading-tight">{feature}</span>
        </li>
      ))}
    </ul>

    <Button
      asChild
      className="w-full h-12 rounded-none text-md font-semibold shadow-none mt-auto"
      variant={buttonVariant as any}
    >
      <Link href={buttonLink}>{buttonText}</Link>
    </Button>
  </div>
);

export default function Pricing() {
  return (
    <div className="w-full">
      <section className="overflow-hidden flex flex-col relative">
        {/* Main Layout Vertical Borders */}
        <div className="absolute inset-y-0 left-2 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-2 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        {/* Section Borders constrained to vertical borders */}
        <div className="absolute top-0 left-2 md:left-12 right-2 md:right-12 h-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute bottom-0 left-2 md:left-12 right-2 md:right-12 h-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        <div className="px-2 md:px-12 w-full flex flex-col relative">
          {/* Background color layer */}
          <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-950/50 -z-20" />

          {/* Vertical sandwiching lines for the whole section height */}
          <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200/50 dark:bg-slate-900/50 z-30 pointer-events-none hidden xl:block" />
          <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200/50 dark:bg-slate-900/50 z-30 pointer-events-none hidden xl:block" />

          <div className="relative flex flex-col items-center justify-center px-4 py-24 text-center bg-transparent">
            {/* Header section */}
            <div className="flex flex-col items-center w-full relative z-20">
              <Badge className="mb-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">Pricing</Badge>
              <h2 className="text-4xl font-bold tracking-tighter text-indigo-950 dark:text-white sm:text-6xl mb-4">
                Ready, set, <span className="text-highlight-blink">deploy</span>
              </h2>
              <p className="text-lg text-gray-800 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12">
                Scale search on Postgres with confidence.
              </p>
            </div>

            {/* Nested Cards Container */}
            <div className="relative w-full z-20">
              {/* Horizontal Lines constrained to the side vertical layout borders */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100vw-16px)] md:w-[calc(100vw-96px)] h-px bg-slate-200 dark:bg-slate-900 hidden md:block z-30 pointer-events-none" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100vw-16px)] md:w-[calc(100vw-96px)] h-px bg-slate-200 dark:bg-slate-900 hidden md:block z-30 pointer-events-none" />

              <div className="relative max-w-[1128px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-900 bg-white dark:bg-slate-900/50">
                <PricingCard
                  planName="Community"
                  badgeText="Self-Managed"
                  description="Perfect for testing and small projects that don't require multiple nodes."
                  features={[
                    "Fully free forever",
                    "Supports a single node (no read replicas)",
                    "Community support",
                  ]}
                  buttonText="Get Started"
                  buttonLink="https://docs.paradedb.com"
                  buttonVariant="light"
                />
                <PricingCard
                  planName="Enterprise"
                  badgeText="Self-Managed"
                  description="For high availability, read replicas, and dedicated support."
                  features={[
                    "Everything in Community",
                    "Read replica support",
                    "High availability",
                    "Dedicated support and SLA"
                  ]}
                  buttonText="Custom Pricing"
                  buttonLink="mailto:sales@paradedb.com"
                />
                <PricingCard
                  planName="Cloud"
                  badgeText="Fully Managed"
                  description="Use ParadeDB without managing any infrastructure."
                  features={[
                    "Everything in Enterprise",
                    "Fully managed",
                    "One-click deployments",
                    "Currently in private beta"
                  ]}
                  buttonText="Join Private Beta"
                  buttonLink="#"
                  buttonVariant="light"
                />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

