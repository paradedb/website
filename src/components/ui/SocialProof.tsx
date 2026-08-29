import Link from "next/link";
import Image from "next/image";
import { RiArrowRightLine } from "@remixicon/react";
import { SectionHeader } from "./SectionHeader";

const CaseStudyCard = ({
  logo,
  quote,
  author,
  role,
  initials,
  href,
}: {
  logo: React.ReactNode;
  quote: string;
  author: string;
  role: string;
  initials: string;
  href: string;
}) => (
  <Link
    href={href}
    className="group relative flex flex-col items-start p-8 md:p-12 text-left overflow-hidden h-full transition-colors duration-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
  >
    {/* Content */}
    <div className="w-full flex flex-col items-start">
      <div className="mb-8 h-8 sm:h-10 flex items-center">{logo}</div>
      <blockquote className="text-sm md:text-lg text-slate-800 dark:text-slate-300 leading-relaxed mb-8">
        {quote}
      </blockquote>
      <div className="mt-auto flex items-center gap-3">
        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-wide border border-slate-200 dark:border-slate-700">
          {initials}
        </div>
        <div className="text-left">
          <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            {author}
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-sm">
            {role}
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default function SocialProof() {
  return (
    <div className="w-full relative bg-white dark:bg-slate-950">
      <section className="overflow-hidden flex flex-col relative max-w-[1440px] mx-auto">
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none" />

        <div className="px-4 md:px-12 w-full flex flex-col relative">
          {/* Section 1: Case Studies */}
          <div className="relative flex flex-col items-center justify-center sm:py-16 py-10 text-center bg-transparent">
            {/* Fades for Case Studies Section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent z-0 pointer-events-none" />

            <div className="mx-auto w-full max-w-[1128px] px-4 sm:px-12 xl:px-0 relative">
              <SectionHeader
                eyebrow="Case Studies"
                title="Trusted by enterprises."
                description="The most innovative companies are simplifying their stack with ParadeDB."
                className="mb-12"
              />
            </div>

            <div className="relative w-full z-20">
              <div className="relative">
                <div className="absolute inset-y-0 left-1/2 -ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
                <div className="absolute inset-y-0 left-1/2 ml-[564px] w-px bg-slate-200 dark:bg-slate-900 z-30 pointer-events-none hidden xl:block" />
                <div className="max-w-[1128px] mx-auto grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-900">
                  <div className="border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-900">
                    <CaseStudyCard
                      href="/customers/case-study-bilt"
                      logo={
                        <Image
                          src="/brand/customers/bilt-rewards.svg"
                          alt="Bilt Rewards"
                          width={179}
                          height={30}
                          className="h-4 w-auto opacity-80 dark:brightness-0 dark:invert"
                        />
                      }
                      quote="“Using ParadeDB has unlocked the ability to rapidly launch new search capabilities across our products — something that previously would have taken weeks of effort.”"
                      initials="JK"
                      author="John King"
                      role="Backend Engineer, Bilt"
                    />
                  </div>

                  <div>
                    <CaseStudyCard
                      href="/customers/case-study-alibaba"
                      logo={
                        <Image
                          src="/brand/customers/alibaba.svg"
                          alt="Alibaba"
                          width={127}
                          height={30}
                          className="h-8 w-auto opacity-80 dark:brightness-0 dark:invert"
                        />
                      }
                      quote="“ParadeDB has excellent performance and throughput in search, helping our clients achieve structured analysis and full-text retrieval using a pure Postgres engine.”"
                      initials="PB"
                      author="Pang Bo"
                      role="Product Manager, Alibaba"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <Link
                  href="/customers"
                  className="group inline-flex items-center gap-2 text-indigo-950 dark:text-white font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  Read other case studies
                  <RiArrowRightLine className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
