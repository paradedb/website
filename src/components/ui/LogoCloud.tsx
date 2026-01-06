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
  const isWhite = variant === "white";

  return (
    <div
      className={cx(
        "flex flex-wrap items-center justify-between w-full py-10 md:py-12 px-8 md:px-16 gap-y-8",
        isIndigo
          ? "bg-[#4f46e5]"
          : isWhite
            ? "bg-transparent"
            : "bg-white dark:bg-slate-950",
        className,
      )}
    >
      <div className="flex items-center justify-center opacity-0 animate-logo delay-1000 fill-mode-both">
        <Logos.BiltRewards
          className={cx(
            "w-16 md:w-18",
            isIndigo || isWhite
              ? "brightness-0 invert opacity-70"
              : "brightness-0 dark:brightness-0 dark:invert opacity-80",
          )}
        />
      </div>
      <div className="flex items-center justify-center opacity-0 animate-logo delay-1000 fill-mode-both">
        <Logos.ModernTreasury
          className={cx(
            "w-28 md:w-36",
            isIndigo || isWhite
              ? "brightness-0 invert opacity-70"
              : "brightness-0 dark:brightness-0 dark:invert opacity-80",
          )}
        />
      </div>
      <div className="flex items-center justify-center opacity-0 animate-logo delay-1000 fill-mode-both">
        <Logos.Alibaba
          className={cx(
            "w-16 md:w-24",
            isIndigo || isWhite
              ? "brightness-0 invert opacity-70"
              : "brightness-0 dark:brightness-0 dark:invert opacity-80",
          )}
        />
      </div>
      <div className="flex items-center justify-center opacity-0 animate-logo delay-1000 fill-mode-both">
        <Logos.Span
          className={cx(
            "w-16 md:w-18",
            isIndigo || isWhite
              ? "brightness-0 invert opacity-70"
              : "brightness-0 dark:brightness-0 dark:invert opacity-80",
          )}
        />
      </div>
      <div className="hidden sm:flex items-center justify-center opacity-0 animate-logo delay-1000 fill-mode-both">
        <Logos.RxVantage
          className={cx(
            "w-20 md:w-28",
            isIndigo || isWhite
              ? "brightness-0 invert opacity-70"
              : "brightness-0 dark:brightness-0 dark:invert opacity-80",
          )}
        />
      </div>
      <div className="flex items-center justify-center opacity-0 animate-logo delay-1000 fill-mode-both">
        <Logos.Tcdi
          className={cx(
            "w-10 md:w-12",
            isIndigo || isWhite
              ? "brightness-0 invert opacity-70"
              : "brightness-0 dark:brightness-0 dark:invert opacity-80",
          )}
        />
      </div>
      <div className="flex items-center justify-center opacity-0 animate-logo delay-1000 fill-mode-both">
        <Logos.DemandScience
          className={cx(
            "w-28 md:w-36",
            isIndigo || isWhite
              ? "brightness-0 invert opacity-70"
              : "brightness-0 dark:brightness-0 dark:invert opacity-80",
          )}
        />
      </div>
    </div>
  );
}
