import { cx } from "@/lib/utils";
import Image from "next/image";

const logos: Array<{
  name: string;
  src: string;
  width: number;
  height: number;
  className: string;
  wrapperClassName?: string;
}> = [
  {
    name: "Bilt Rewards",
    src: "/brand/customers/bilt-rewards.svg",
    width: 179,
    height: 30,
    className: "w-14 md:w-20",
  },
  {
    name: "Modern Treasury",
    src: "/brand/customers/modern-treasury.svg",
    width: 344,
    height: 30,
    className: "w-48 md:w-40",
  },
  {
    name: "Alibaba",
    src: "/brand/customers/alibaba.svg",
    width: 127,
    height: 30,
    className: "w-20 md:w-28",
  },
  {
    name: "Span",
    src: "/brand/customers/span.svg",
    width: 110,
    height: 29,
    className: "w-16 md:w-20",
  },
  {
    name: "TCDI",
    src: "/brand/customers/tcdi.svg",
    width: 681,
    height: 242,
    className: "w-10 md:w-11",
    wrapperClassName: "sm:order-3",
  },
  {
    name: "SafetyCulture",
    src: "/brand/customers/safety-culture.svg",
    width: 202,
    height: 38,
    className: "w-28 md:w-32",
    wrapperClassName: "sm:order-1",
  },
  {
    name: "RxVantage",
    src: "/brand/customers/rx-vantage.svg",
    width: 200,
    height: 30,
    className: "w-22 md:w-32",
    wrapperClassName: "hidden sm:order-2 sm:flex",
  },
  {
    name: "DemandScience",
    src: "/brand/customers/demand-science.svg",
    width: 290,
    height: 30,
    className: "w-32 md:w-40",
    wrapperClassName: "hidden sm:order-4 sm:flex",
  },
];

export default function LogoCloud({
  variant = "indigo",
  className,
}: {
  variant?: "indigo" | "white" | "light";
  className?: string;
}) {
  const isIndigo = variant === "indigo";
  const isWhite = variant === "white";
  const isLight = variant === "light";

  const logoClass = cx(
    isLight
      ? "brightness-0 dark:invert opacity-80"
      : isIndigo || isWhite
        ? "brightness-0 invert opacity-70"
        : "brightness-0 dark:brightness-0 dark:invert opacity-80",
  );

  return (
    <div
      className={cx(
        "grid grid-cols-3 sm:flex sm:flex-wrap items-center sm:justify-between w-full py-10 md:py-12 px-6 sm:px-8 md:px-16 gap-y-10 sm:gap-y-8 gap-x-4",
        isIndigo
          ? "bg-[#4f46e5]"
          : isWhite || isLight
            ? "bg-transparent"
            : "bg-white dark:bg-slate-950",
        isLight && "[&_img]:scale-[0.9]",
        className,
      )}
    >
      {logos.map((logo) => (
        <div
          key={logo.name}
          className={cx(
            "flex items-center justify-center opacity-0 animate-logo delay-700 fill-mode-both",
            logo.wrapperClassName,
          )}
        >
          <Image
            src={logo.src}
            alt={logo.name}
            width={logo.width}
            height={logo.height}
            className={cx(logo.className, "h-auto", logoClass)}
          />
        </div>
      ))}
    </div>
  );
}
