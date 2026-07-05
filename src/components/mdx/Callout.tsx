import type { ReactNode } from "react";
import {
  RiInformationLine,
  RiErrorWarningLine,
  RiCheckboxCircleLine,
  RiErrorWarningFill,
  RiLightbulbLine,
} from "@remixicon/react";
import { cx } from "@/lib/utils";

export type CalloutVariant =
  | "info"
  | "note"
  | "warning"
  | "success"
  | "danger"
  | "tip";

export interface CalloutProps {
  variant: CalloutVariant;
  className?: string;
  children: ReactNode;
}

const variantIcons = {
  info: RiInformationLine,
  note: RiInformationLine,
  warning: RiErrorWarningLine,
  success: RiCheckboxCircleLine,
  danger: RiErrorWarningFill,
  tip: RiLightbulbLine,
};

const variantRoles: Record<CalloutVariant, string> = {
  info: "note",
  note: "note",
  warning: "alert",
  success: "status",
  danger: "alert",
  tip: "note",
};

export function Callout({ variant, className, children }: CalloutProps) {
  const Icon = variantIcons[variant];
  const role = variantRoles[variant];

  return (
    <div
      data-slot="callout-root"
      data-variant={variant}
      role={role}
      aria-label={`${variant} callout`}
      className={cx("mt-callout", `mt-callout-${variant}`, "flex", className)}
    >
      <div className="mt-callout-icon-wrapper">
        <Icon
          className="mt-callout-icon mt-icon"
          style={{ width: "16px", height: "16px" }}
        />
      </div>
      <div data-slot="callout-content" className="mt-callout-content">
        <div data-slot="callout-content-body" className="mt-callout-body">
          {children}
        </div>
      </div>
    </div>
  );
}
