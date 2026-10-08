"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-[#0087d6] hover:shadow-[0_0_32px_rgba(0,163,255,0.35)]",
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

/* Liquid glass button: refraction via SVG displacement filter + blue tint. */
const liquidButtonVariants = cva(
  "relative inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-semibold text-white outline-none transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
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

export function GlassFilter() {
  return (
    <svg className="hidden" aria-hidden>
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

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
      {/* refraction layer */}
      <div
        className="absolute inset-0 isolate -z-10 overflow-hidden rounded-full"
        style={{ backdropFilter: 'url("#container-glass")' }}
      />
      <span className="pointer-events-none relative z-10">{children}</span>
      <GlassFilter />
    </button>
  );
}
