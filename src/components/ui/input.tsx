import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base — konsisten dengan design system
          "flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-[#17211B]",
          "placeholder:text-slate-400",
          "shadow-sm",
          // Focus
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:border-[#166534] focus-visible:ring-2 focus-visible:ring-[#166534]/20",
          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
          // File input
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#166534]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
