import { type LucideIcon } from "lucide-react";
import Link from "next/link";

type InteriorHeroProps = {
  bgImage: string;
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
  current: string;
  icon?: LucideIcon;
};

export function InteriorHero({
  bgImage,
  eyebrow,
  title,
  accent,
  description,
  current,
  icon: Icon,
}: InteriorHeroProps) {
  return (
    <section className="relative flex min-h-[52vh] flex-col justify-end overflow-hidden pt-24 pb-14">
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="" aria-hidden className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,18,11,0.82)_0%,rgba(5,18,11,0.62)_43%,rgba(5,18,11,0.30)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.52)_0%,rgba(0,0,0,0.12)_48%,#FAF9F6_100%)]" />
        <div className="absolute inset-y-0 left-0 w-[62%] bg-[radial-gradient(ellipse_at_24%_58%,rgba(11,30,18,0.92)_0%,rgba(11,30,18,0.66)_38%,rgba(11,30,18,0)_72%)]" />
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-2 text-xs font-extrabold uppercase tracking-widest text-[#D6E7DC] shadow-sm ring-1 ring-white/20 backdrop-blur-md">
          {Icon && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
              <Icon className="h-3.5 w-3.5" />
            </span>
          )}
          {eyebrow}
        </div>

        <h1 className="hero-readable-title max-w-3xl text-4xl font-black leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
          {title}
          {accent && <span className="block text-[#C8DDCF]">{accent}</span>}
        </h1>

        <p className="hero-readable-copy mt-5 max-w-2xl text-base font-semibold leading-relaxed md:text-lg">
          {description}
        </p>

        <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white/80">
          <Link href="/" className="transition-colors hover:text-white">Beranda</Link>
          <span className="text-white/45">/</span>
          <span className="text-white">{current}</span>
        </div>
      </div>
    </section>
  );
}
