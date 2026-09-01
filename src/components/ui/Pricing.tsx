import { Badge } from "./Badge";
import { SectionHeader } from "./SectionHeader";
import { CardWave } from "./CardWave";
import { cx } from "@/lib/utils";
import { Button } from "../Button";
import Link from "next/link";
import { RiCheckLine } from "@remixicon/react";
import { documentation, social } from "@/lib/links";

const PricingCard = ({
  planName,
  description,
  features,
  buttonText,
  buttonLink,
  buttonVariant = "primary",
  badgeText,
  featured = false,
}: {
  planName: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  buttonVariant?: "primary" | "secondary" | "light";
  badgeText: string;
  featured?: boolean;
}) => (
  <div className="relative h-full">
    <div
      className={cx(
        "relative flex flex-col p-6 sm:p-8 md:p-12 h-full text-left items-start",
        featured
          ? "bg-slate-50 dark:bg-slate-900 md:bg-indigo-600 md:dark:bg-indigo-600 md:text-white"
          : "bg-slate-50 dark:bg-slate-900",
      )}
    >
      {featured && <CardWave color="#ffffff2e" className="hidden md:block" />}
      <div className="relative mb-6 sm:mb-8 w-full">
        <div className="flex justify-start mb-2">
          <Badge
            className={cx(
              "py-0.5 px-2 text-[10px]",
              featured &&
                "md:bg-white/15 md:border-white/40 md:text-white md:dark:bg-white/15 md:dark:border-white/40 md:dark:text-white",
            )}
          >
            {badgeText}
          </Badge>
        </div>
        <div className="flex items-baseline justify-start gap-1 mb-4">
          <span
            className={cx(
              "text-2xl sm:text-3xl font-bold",
              featured
                ? "text-indigo-950 dark:text-white md:text-white"
                : "text-indigo-950 dark:text-white",
            )}
          >
            {planName}
          </span>
        </div>
        <p
          className={cx(
            "text-sm leading-relaxed",
            featured
              ? "text-slate-600 dark:text-slate-400 md:text-indigo-100 md:dark:text-indigo-100"
              : "text-slate-600 dark:text-slate-400",
          )}
        >
          {description}
        </p>
      </div>

      <ul className="relative space-y-4 mb-10 w-full text-left">
        {features.map((feature, i) => (
          <li
            key={i}
            className={cx(
              "flex items-start gap-3 text-sm",
              featured
                ? "text-slate-700 dark:text-slate-300 md:text-indigo-50 md:dark:text-indigo-50"
                : "text-slate-700 dark:text-slate-300",
            )}
          >
            <RiCheckLine
              className={cx(
                "size-5 shrink-0",
                featured
                  ? "text-indigo-600 dark:text-indigo-400 md:text-indigo-200 md:dark:text-indigo-200"
                  : "text-indigo-600 dark:text-indigo-400",
              )}
            />
            <span className="leading-tight">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        className={cx(
          "w-full h-12 rounded-none text-md font-semibold shadow-none mt-auto",
          featured &&
            "border-0 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700 md:bg-white md:text-indigo-600 md:hover:bg-indigo-50 md:dark:bg-white md:dark:text-indigo-600 md:dark:hover:bg-indigo-50",
        )}
        variant={buttonVariant as any}
      >
        <Link
          href={buttonLink}
          target={buttonLink.startsWith("http") ? "_blank" : undefined}
          rel={
            buttonLink.startsWith("http") ? "noopener noreferrer" : undefined
          }
        >
          {buttonText}
        </Link>
      </Button>
    </div>
  </div>
);

export default function Pricing() {
  return (
    <div className="w-full relative bg-white dark:bg-slate-950">
      <section className="overflow-hidden flex flex-col relative max-w-[1440px] mx-auto">
        {/* Main Layout Vertical Borders */}
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        <div className="px-4 md:px-12 w-full flex flex-col relative">
          <div className="relative flex flex-col items-center justify-center py-10 sm:py-16 text-center bg-transparent">
            {/* Header section */}
            <div className="mx-auto w-full max-w-[1128px] px-4 sm:px-12 xl:px-0 relative">
              <SectionHeader
                eyebrow="Pricing"
                title="Ready, set, deploy."
                description="From self-hosted to fully managed, deploy ParadeDB your way."
                className="mb-12"
              />
            </div>

            {/* Nested Cards Container */}
            <div className="relative w-full z-20">
              <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
              <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
              <div className="max-w-[1128px] mx-auto grid grid-cols-1 md:grid-cols-3 border-y border-slate-200 dark:border-slate-800 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
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
                  buttonLink={documentation.GETTING_STARTED}
                />
                <PricingCard
                  planName="Cloud"
                  badgeText="Coming Soon"
                  description="Use ParadeDB without managing any infrastructure."
                  features={[
                    "Everything in Enterprise",
                    "Fully managed",
                    "One-click deployments",
                  ]}
                  buttonText="Early Access"
                  buttonLink="/cloud"
                  buttonVariant="light"
                  featured
                />
                <PricingCard
                  planName="Enterprise"
                  badgeText="Self-Managed"
                  description="For high availability, read replicas, and dedicated support."
                  features={[
                    "Everything in Community",
                    "Read replica support",
                    "High availability",
                    "Dedicated support and SLA",
                  ]}
                  buttonText="Custom Pricing"
                  buttonLink={social.CALENDLY}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
