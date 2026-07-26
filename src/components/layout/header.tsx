"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  desaName: string;
  logo: string;
  kecamatan: string;
  kabupaten: string;
}

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Layanan", href: "/layanan" },
  { label: "EduVillage", href: "/eduvillage" },
  { label: "Berita", href: "/berita" },
  { label: "Pengaduan", href: "/pengaduan" },
];

export default function Header({ desaName, logo, kecamatan, kabupaten }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-[#6B8E7B]/10 shadow-sm py-3"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* ── Brand ── */}
          <Link href="/" className="flex items-center gap-3 group">
            {logo ? (
              <img src={logo} alt="Logo" className="h-10 w-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-[#6B8E7B] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                {desaName.charAt(0)}
              </div>
            )}
            <div className="flex flex-col">
              <span className={`font-extrabold tracking-tight leading-tight transition-colors ${isScrolled ? "text-[#334155]" : "text-white drop-shadow-md"}`}>
                {desaName}
              </span>
              <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${isScrolled ? "text-[#64748B]" : "text-white/80 drop-shadow-md"}`}>
                {kecamatan}, {kabupaten}
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full px-2 py-1 border border-white/20">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? (isScrolled ? "bg-[#6B8E7B]/10 text-[#6B8E7B]" : "bg-white/20 text-white")
                      : (isScrolled ? "text-[#64748B] hover:text-[#334155] hover:bg-slate-50" : "text-white/90 hover:text-white hover:bg-white/10")
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ── CTA & Mobile Toggle ── */}
          <div className="flex items-center gap-3">
            <Link
              href="/layanan"
              className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-[#334155] font-bold text-sm shadow-sm hover:shadow-md transition-all"
            >
              Layanan Digital
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`h-10 w-10 md:hidden flex items-center justify-center rounded-full transition-colors ${
                isScrolled ? "bg-slate-100 text-slate-700" : "bg-white/20 text-white"
              }`}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#FAF9F6] animate-fade-in flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-[#6B8E7B]/10">
            <div className="flex items-center gap-3">
              {logo && <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />}
              <span className="font-extrabold text-[#334155]">{desaName}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center gap-6">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-black text-[#334155] hover:text-[#6B8E7B] transition-colors"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="p-6 border-t border-[#6B8E7B]/10">
            <Link
              href="/layanan"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-full py-4 rounded-full bg-[#6B8E7B] text-white font-bold text-lg"
            >
              Layanan Digital
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
