"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base — konsisten di seluruh app
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Primary — brand green
        default:
          "bg-[#166534] text-white shadow-sm hover:bg-[#14532D]",
        // Destructive
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700",
        // Outlined brand green
        outline:
          "border-2 border-[#166534] text-[#166534] bg-transparent hover:bg-[#ECFDF3]",
        // Ghost — subtle
        ghost:
          "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        // Secondary — light green fill
        secondary:
          "bg-[#ECFDF3] text-[#166534] hover:bg-green-100",
        // Link
        link:
          "text-[#166534] underline-offset-4 hover:underline p-0 h-auto shadow-none",
        // Slate — for admin secondary actions
        slate:
          "bg-slate-800 text-white shadow-sm hover:bg-slate-700",
      },
      size: {
        sm:      "h-8  px-3  text-xs  rounded-md",
        default: "h-10 px-5  text-sm",
        lg:      "h-12 px-7  text-base",
        xl:      "h-14 px-9  text-base",
        icon:    "h-10 w-10",
        "icon-sm":"h-8  w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
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
