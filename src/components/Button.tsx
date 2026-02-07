// Tremor Raw Button [v0.1.1]

import { cx, focusRing } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { RiLoader2Fill } from "@remixicon/react";
import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: [
    // base
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg border px-3 py-2 text-center text-sm font-medium shadow-sm transition-all duration-100 ease-in-out",
    // disabled
    "disabled:pointer-events-none disabled:shadow-none",
    // focus
    focusRing,
  ],
  variants: {
    variant: {
      primary: [
        // border
        "border-transparent",
        // text color
        "text-white",
        // background color
        "bg-indigo-600",
        // hover color
        "hover:bg-indigo-700",
        // disabled
        "disabled:bg-indigo-100 disabled:text-indigo-400",
      ],
      secondary: [
        // border
        "border-gray-300 dark:border-slate-800",
        // text color
        "text-gray-900 dark:text-slate-100",
        // background color
        "bg-white dark:bg-slate-900",
        //hover color
        "hover:bg-gray-50 dark:hover:bg-slate-800",
        // disabled
        "disabled:text-gray-400 dark:disabled:text-gray-600",
      ],
      light: [
        // base
        "shadow-none",
        // border
        "border-transparent",
        // text color
        "text-gray-900 dark:text-slate-100",
        // background color
        "bg-gray-200 dark:bg-slate-800",
        // hover color
        "hover:bg-gray-300/70 dark:hover:bg-slate-700/70",
        // disabled
        "disabled:bg-gray-100 dark:disabled:bg-slate-900 disabled:text-gray-400 dark:disabled:text-gray-600",
      ],
      ghost: [
        // base
        "shadow-none",
        // border
        "border-transparent",
        // text color
        "text-gray-900 dark:text-slate-100",
        // hover color
        "bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800",
        // disabled
        "disabled:text-gray-400 dark:disabled:text-gray-600",
      ],
      destructive: [
        // text color
        "text-white",
        // border
        "border-transparent",
        // background color
        "bg-red-600",
        // hover color
        "hover:bg-red-700",
        // disabled
        "disabled:bg-red-300 disabled:text-white",
      ],
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface ButtonProps
  extends
    React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      isLoading = false,
      loadingText,
      className,
      disabled,
      variant,
      children,
      ...props
    }: ButtonProps,
    forwardedRef,
  ) => {
    const Component = asChild ? Slot : "button";
    return (
      <Component
        ref={forwardedRef}
        className={cx(buttonVariants({ variant }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="pointer-events-none flex shrink-0 items-center justify-center gap-1.5">
            <RiLoader2Fill
              className="size-4 shrink-0 animate-spin"
              aria-hidden="true"
            />
            <span className="sr-only">
              {loadingText ? loadingText : "Loading"}
            </span>
            {loadingText ? loadingText : children}
          </span>
        ) : (
          children
        )}
      </Component>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps };
