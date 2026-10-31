"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[color,background-color,border-color,box-shadow,opacity,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-[#07121c] hover:bg-[#0087d6] hover:shadow-[0_0_32px_rgba(0,163,255,0.35)]",
        secondary:
          "border border-line bg-carddeep/80 text-ink hover:text-white hover:border-primary/60",
        ghost: "text-muted hover:text-ink",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-11 px-6",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

/* Shared glass button surface and press feedback. */
const liquidButtonVariants = cva(
  "relative inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-semibold text-[#07121c] focus-visible:ring-2 focus-visible:ring-[#7dd3fc] focus-visible:ring-offset-4 focus-visible:ring-offset-abyss outline-none transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10 px-6",
        sm: "h-9 px-5 text-[13px]",
        lg: "h-11 px-7",
      },
    },
    defaultVariants: { size: "default" },
  }
);

export function LiquidButton({
  className,
  size,
  children,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof liquidButtonVariants>) {
  return (
    <button
      data-slot="button"
      className={cn(liquidButtonVariants({ size, className }))}
      {...props}
    >
      {/* blue glass base */}
      <div className="absolute inset-0 z-0 rounded-full bg-primary/85 shadow-[0_0_24px_rgba(0,163,255,0.35),inset_1px_1px_1px_rgba(255,255,255,0.35),inset_-1px_-1px_1px_rgba(0,0,0,0.25)]" />
      <span className="pointer-events-none relative z-10">{children}</span>
    </button>
  );
}
