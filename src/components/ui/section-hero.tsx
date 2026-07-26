import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface SectionHeroProps {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  /** Override bg color class */
  dark?: boolean;
}

/**
 * Unified Page Banner — konsisten di semua halaman interior.
 * Dark forest background with premium typography.
 */
export default function SectionHero({
  icon: Icon,
  eyebrow,
  title,
  description,
  breadcrumbs,
  dark = true,
}: SectionHeroProps) {
  return (
    <div className="relative overflow-hidden bg-[#0B1E12]">
      {/* Decorative grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #4ade80 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Gradient overlays */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#0B1E12] via-[#0B1E12]/95 to-[#166534]/30" />
      <div aria-hidden className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B1E12] to-transparent" />

      {/* Glow blob */}
      <div aria-hidden className="absolute top-0 right-0 w-96 h-96 bg-[#166534]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-12">

        {/* Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center flex-wrap gap-1.5 text-xs font-medium text-white/40">
              <li>
                <Link href="/" className="flex items-center gap-1 hover:text-white/70 transition-colors">
                  <Home className="h-3 w-3" />
                  Beranda
                </Link>
              </li>
              {breadcrumbs.filter(b => b.label !== "Beranda").map((crumb, i, arr) => {
                const isLast = i === arr.length - 1;
                return (
                  <li key={i} className="flex items-center gap-1.5">
                    <ChevronRight className="h-3 w-3 text-white/20 shrink-0" />
                    {isLast || !crumb.href ? (
                      <span className={isLast ? "text-white/80" : "hover:text-white/70 transition-colors"}>
                        {crumb.label}
                      </span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-white/70 transition-colors">
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {/* Eyebrow */}
        {eyebrow && (
          <div className="flex items-center gap-2 mb-4">
            {Icon && (
              <div className="h-7 w-7 rounded-lg bg-[#166534]/40 border border-[#4ade80]/20 flex items-center justify-center">
                <Icon className="h-4 w-4 text-[#4ade80]" aria-hidden />
              </div>
            )}
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#4ade80]">
              {eyebrow}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] mb-4 max-w-3xl">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-base sm:text-lg text-white/55 font-normal max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Bottom border accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#166534]/50 to-transparent" />
    </div>
  );
}
