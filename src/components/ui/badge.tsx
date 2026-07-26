import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-slate-100 text-slate-700 border border-slate-200",
        outline:     "text-slate-700 border border-slate-200 bg-transparent",
        primary:     "bg-[#ECFDF3] text-[#166534] border border-green-200",
        success:     "bg-green-50  text-green-700  border border-green-200",
        warning:     "bg-amber-50  text-amber-700  border border-amber-200",
        danger:      "bg-red-50    text-red-700    border border-red-200",
        info:        "bg-blue-50   text-blue-700   border border-blue-200",
        // Status khusus pengaduan
        menunggu:    "bg-amber-50  text-amber-700  border border-amber-200",
        diproses:    "bg-blue-50   text-blue-700   border border-blue-200",
        selesai:     "bg-green-50  text-green-700  border border-green-200",
        ditolak:     "bg-red-50    text-red-700    border border-red-200",
        // Status konten
        published:   "bg-green-50  text-green-700  border border-green-200",
        draft:       "bg-slate-100 text-slate-600  border border-slate-200",
        archived:    "bg-orange-50 text-orange-700 border border-orange-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
