import { Logos } from "./Logos";
import { cx } from "@/lib/utils";

export default function LogoCloud({
  variant = "indigo",
  className,
}: {
  variant?: "indigo" | "white";
  className?: string;
}) {
  const isIndigo = variant === "indigo";

  return (
    <div
      className={cx(
        "flex flex-wrap items-center justify-center gap-x-8 md:gap-x-12 lg:gap-x-20 py-8 md:py-12",
        isIndigo ? "bg-[#4f46e5]" : "bg-white dark:bg-slate-950",
        className
      )}
    >
      <Logos.BiltRewards
        className={cx(
          "w-16 md:w-20",
          isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 dark:brightness-0 dark:invert opacity-80"
        )}
      />
      <Logos.ModernTreasury
        className={cx(
          "w-28 md:w-36",
          isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 dark:brightness-0 dark:invert opacity-80"
        )}
      />
      <Logos.Alibaba
        className={cx(
          "w-16 md:w-24",
          isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 dark:brightness-0 dark:invert opacity-80"
        )}
      />
      <Logos.RxVantage
        className={cx(
          "w-20 md:w-28",
          isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 dark:brightness-0 dark:invert opacity-80"
        )}
      />
      <Logos.Tcdi
        className={cx(
          "w-10 md:w-12",
          isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 dark:brightness-0 dark:invert opacity-80"
        )}
      />
      <Logos.DemandScience
        className={cx(
          "w-28 md:w-36",
          isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 dark:brightness-0 dark:invert opacity-80"
        )}
      />
    </div>
  );
}
