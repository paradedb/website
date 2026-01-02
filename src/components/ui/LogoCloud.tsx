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
        "grid grid-cols-2 md:grid-cols-4",
        isIndigo
          ? "bg-[#4f46e5] border-t border-indigo-500"
          : "bg-white border-t border-slate-200",
        className
      )}
    >
      <div
        className={cx(
          "flex items-center justify-center px-4 py-6 md:p-8 border-b border-r",
          isIndigo ? "border-indigo-500" : "border-slate-200"
        )}
      >
        <Logos.BiltRewards
          className={cx(
            "w-16 md:w-20",
            isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 opacity-80"
          )}
        />
      </div>
      <div
        className={cx(
          "flex items-center justify-center px-4 py-6 md:p-8 border-b border-r",
          isIndigo ? "border-indigo-500" : "border-slate-200"
        )}
      >
        <Logos.ModernTreasury
          className={cx(
            "w-28 md:w-36",
            isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 opacity-80"
          )}
        />
      </div>
      <div
        className={cx(
          "flex items-center justify-center px-4 py-6 md:p-8 border-b border-r",
          isIndigo ? "border-indigo-500" : "border-slate-200"
        )}
      >
        <Logos.Alibaba
          className={cx(
            "w-16 md:w-24",
            isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 opacity-80"
          )}
        />
      </div>
      <div
        className={cx(
          "flex items-center justify-center px-4 py-6 md:p-8 border-b",
          isIndigo ? "border-indigo-500 md:border-r-0" : "border-slate-200 md:border-r-0"
        )}
      >
        <Logos.Unify
          className={cx(
            "w-16 md:w-20",
            isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 opacity-80"
          )}
        />
      </div>
      <div
        className={cx(
          "flex items-center justify-center px-4 py-6 md:p-8 border-r",
          isIndigo
            ? "border-indigo-500 border-b md:border-b-0"
            : "border-slate-200 border-b md:border-b-0"
        )}
      >
        <Logos.Tcdi
          className={cx(
            "w-10 md:w-12",
            isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 opacity-80"
          )}
        />
      </div>
      <div
        className={cx(
          "flex items-center justify-center px-4 py-6 md:p-8 border-r",
          isIndigo
            ? "border-indigo-500 border-b md:border-b-0"
            : "border-slate-200 border-b md:border-b-0"
        )}
      >
        <Logos.DemandScience
          className={cx(
            "w-28 md:w-36",
            isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 opacity-80"
          )}
        />
      </div>
      <div
        className={cx(
          "flex items-center justify-center px-4 py-6 md:p-8 border-r",
          isIndigo ? "border-indigo-500" : "border-slate-200"
        )}
      >
        <Logos.RxVantage
          className={cx(
            "w-20 md:w-28",
            isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 opacity-80"
          )}
        />
      </div>
      <div className="flex items-center justify-center px-4 py-6 md:p-8">
        <Logos.Cofactr
          className={cx(
            "w-16 md:w-24",
            isIndigo ? "brightness-0 invert opacity-70" : "brightness-0 opacity-80"
          )}
        />
      </div>
    </div>
  );
}
