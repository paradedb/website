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
        "grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-20 py-10 md:py-12 px-6 sm:px-0",
        isIndigo ? "bg-[#4f46e5]" : "bg-white dark:bg-slate-950",
        className
      )}
    >
      <div className="flex items-center justify-center">
        <Logos.BiltRewards
          className={cx(
            "w-16 md:w-20",
            isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 dark:brightness-0 dark:invert opacity-80"
          )}
        />
      </div>
      <div className="flex items-center justify-center">
        <Logos.ModernTreasury
          className={cx(
            "w-28 md:w-36",
            isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 dark:brightness-0 dark:invert opacity-80"
          )}
        />
      </div>
      <div className="flex items-center justify-center">
        <Logos.Alibaba
          className={cx(
            "w-16 md:w-24",
            isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 dark:brightness-0 dark:invert opacity-80"
          )}
        />
      </div>
      <div className="flex items-center justify-center">
        <Logos.RxVantage
          className={cx(
            "w-20 md:w-28",
            isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 dark:brightness-0 dark:invert opacity-80"
          )}
        />
      </div>
      <div className="flex items-center justify-center">
        <Logos.Tcdi
          className={cx(
            "w-10 md:w-12",
            isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 dark:brightness-0 dark:invert opacity-80"
          )}
        />
      </div>
      <div className="flex items-center justify-center">
        <Logos.DemandScience
          className={cx(
            "w-28 md:w-36",
            isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 dark:brightness-0 dark:invert opacity-80"
          )}
        />
      </div>
    </div>
  );
}
