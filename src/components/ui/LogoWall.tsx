import Image from "next/image";
import Link from "next/link";
import { ArrowAnimated } from "./ArrowAnimated";
import { cx } from "@/lib/utils";
import { DarkModeOverlay } from "./DarkModeOverlay";

const logos = [
  {
    name: "Modern Treasury",
    src: "/brand/customers/modern-treasury.svg",
    width: 344,
    height: 30,
    className: "h-[10px]",
  },
  {
    name: "Bilt Rewards",
    src: "/brand/customers/bilt-rewards.svg",
    width: 179,
    height: 30,
    className: "h-[11px]",
  },
  {
    name: "Alibaba",
    src: "/brand/customers/alibaba.svg",
    width: 127,
    height: 30,
    className: "h-[17px]",
  },
  {
    name: "SafetyCulture",
    src: "/brand/customers/safety-culture.svg",
    width: 202,
    height: 38,
    className: "h-[15px]",
  },
  {
    name: "RxVantage",
    src: "/brand/customers/rx-vantage.svg",
    width: 200,
    height: 30,
    className: "h-[13px]",
  },
  {
    name: "Span",
    src: "/brand/customers/span.svg",
    width: 110,
    height: 29,
    className: "h-[15px]",
  },
  {
    name: "TCDI",
    src: "/brand/customers/tcdi.svg",
    width: 681,
    height: 242,
    className: "h-3.5",
  },
  {
    name: "DemandScience",
    src: "/brand/customers/demand-science.svg",
    width: 290,
    height: 30,
    className: "h-[11px]",
  },
  {
    name: "Terrapin Finance",
    src: "/brand/customers/terrapin.png",
    width: 500,
    height: 92,
    className: "h-[17px]",
    wrapperClassName: "max-sm:hidden",
  },
  {
    name: "Cofactr",
    src: "/brand/customers/cofactr.svg",
    width: 118,
    height: 22,
    className: "h-3",
    wrapperClassName: "max-sm:hidden",
  },
];

export default function LogoWall() {
  return (
    <div className="w-full relative bg-indigo-600">
      <DarkModeOverlay />
      <section
        aria-label="Customers"
        className="relative max-w-[1440px] mx-auto"
      >
        <div className="absolute inset-y-0 left-4 md:left-12 w-px bg-white/20 z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-4 md:right-12 w-px bg-white/20 z-30 pointer-events-none" />

        <div className="px-4 md:px-12 w-full">
          <div className="border-y border-white/20">
            <div className="h-8 md:h-12 w-full bg-diagonal-hatch-white bg-indigo-700/20 opacity-60" />
          </div>
          <div className="border-b border-white/20 px-6 sm:px-16 lg:px-24 grid lg:grid-cols-[minmax(0,3fr)_minmax(0,11fr)]">
            <div className="flex flex-col justify-between gap-5 lg:gap-8 pt-6 sm:pt-16 lg:py-20 lg:pr-10">
              <p className="text-xl sm:text-2xl font-semibold tracking-tight leading-[1.25] text-indigo-200 max-w-md">
                Trusted by the world&apos;s most{" "}
                <span className="text-white">ambitious</span> companies.
              </p>
              <Link
                href="/customers"
                className="group hidden sm:inline-flex w-fit items-center gap-2 text-sm font-medium text-white transition-colors hover:text-indigo-100"
              >
                Read customer stories
                <ArrowAnimated
                  className="stroke-white group-hover:stroke-indigo-100"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <ul className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 pt-5 sm:pt-8 lg:pt-20 pb-6 sm:pb-16 lg:pb-20 lg:pl-6">
              {logos.map((logo) => (
                <li
                  key={logo.name}
                  className={cx(
                    logo.wrapperClassName,
                    "h-20 sm:h-24 lg:h-32 flex items-center justify-center px-3 py-4 bg-white/5 border border-white/20 rounded-sm",
                  )}
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={logo.width}
                    height={logo.height}
                    className={cx(
                      logo.className,
                      "w-auto max-w-full object-contain lg:scale-[1.15] brightness-0 invert opacity-90",
                    )}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
