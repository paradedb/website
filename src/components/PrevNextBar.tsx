import { Button } from "@/components/Button";
import { ArrowAnimated } from "@/components/ui/ArrowAnimated";
import Link from "next/link";

interface PrevNextBarProps {
  previousHref?: string;
  nextHref?: string;
  previousLabel?: string;
  nextLabel?: string;
  position: "top" | "bottom";
}

export function PrevNextBar({
  previousHref,
  nextHref,
  previousLabel = "Previous",
  nextLabel = "Next",
  position,
}: PrevNextBarProps) {
  if (!previousHref && !nextHref) return null;

  return (
    <div className="px-4 md:px-12 w-full relative z-30">
      <div
        className={`${position === "top" ? "border-b h-12" : "border-t h-16"} border-slate-100 dark:border-slate-900 flex justify-between items-center px-6`}
      >
        <div className="flex items-center">
          {previousHref && (
            <Button
              asChild
              className="group bg-transparent px-0 text-gray-600 dark:text-slate-400 hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
              variant="light"
            >
              <Link href={previousHref}>
                <ArrowAnimated
                  className="relative right-3 rotate-180 transform stroke-gray-600 dark:stroke-slate-400"
                  aria-hidden="true"
                />
                <div>{previousLabel}</div>
              </Link>
            </Button>
          )}
        </div>
        <div className="flex items-center">
          {nextHref && (
            <Button
              asChild
              className="group bg-transparent px-0 text-gray-600 dark:text-slate-400 hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
              variant="light"
            >
              <Link href={nextHref}>
                {nextLabel}
                <ArrowAnimated
                  className="stroke-gray-600 dark:stroke-slate-400"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
