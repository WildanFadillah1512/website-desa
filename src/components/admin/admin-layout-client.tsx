"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users, FileText, Database,
  MessageSquare, LogOut, Menu, X, ChevronRight, Globe, ShieldCheck
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem =
  | { type: "divider"; label: string; href?: never; icon?: never; exact?: never }
  | { href: string; icon: LucideIcon; label: string; exact?: boolean; type?: never };

const navItems: NavItem[] = [
  { type: "divider", label: "Manajemen Konten" },
  { href: "/admin/berita", icon: FileText, label: "Berita & Artikel" },
  { href: "/admin/pengaduan", icon: MessageSquare, label: "Pengaduan Masyarakat" },
  { type: "divider", label: "Konfigurasi Sistem" },
  { href: "/admin/collections", icon: Database, label: "Dynamic Builder" },
  { href: "/admin/users", icon: Users, label: "Aparatur Desa" },
];

export function AdminLayoutClient({
  children,
  user,
  logo,
  desaName,
}: {
  children: ReactNode;
  user: any;
  logo?: string;
  desaName?: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (!pathname) return false;
    return exact ? pathname === href : pathname.startsWith(href);
  };

  // Generate breadcrumb from pathname
  const pathSegments = pathname?.split('/').filter(Boolean) || [];
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return { label, href, isLast: index === pathSegments.length - 1 };
  });

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      
      {/* ── Mobile Overlay ─────────────────────────────────────── */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── SIDEBAR ────────────────────────────────────────────── */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-100">
          <Link href="/admin/pengaduan" className="flex items-center gap-2.5 font-bold text-[#17211B]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm ring-1 ring-[#166534]/15">
              {logo ? (
                <img src={logo} alt={`Logo ${desaName || "Desa"}`} className="h-full w-full object-contain" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-[#166534]" />
              )}
            </div>
            <span className="leading-tight">
              <span className="block">Admin Panel</span>
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{desaName || "Desa"}</span>
            </span>
          </Link>
          <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5 text-slate-500" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-4 scrollbar-thin">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item, index) => {
              if (item.type === "divider") {
                return (
                  <div key={index} className="mt-4 mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {item.label}
                  </div>
                );
              }

              const active = isActive(item.href!, item.exact);
              const Icon = item.icon!;

              return (
                <Link 
                  key={index} 
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    active 
                      ? "text-[#166534] bg-[#ECFDF3] shadow-sm ring-1 ring-green-200/50" 
                      : "text-slate-600 hover:text-[#17211B] hover:bg-slate-50"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-[#166534]" : "text-slate-400")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0 text-red-500" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* ── MAIN CONTENT ───────────────────────────────────────── */}
      <main className="flex flex-1 flex-col lg:pl-[260px] min-w-0">
        
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon-sm" className="lg:hidden text-slate-500" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>

            {/* Breadcrumb */}
            <nav className="hidden sm:flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-slate-500">
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.href} className="flex items-center">
                    {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-slate-300" />}
                    {crumb.isLast ? (
                      <span className="font-semibold text-[#17211B]">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-[#166534] transition-colors">
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <Button variant="outline" size="sm"  className="hidden sm:flex h-8 bg-white">
              <Link href="/" target="_blank" className="flex items-center">
                <Globe className="h-3.5 w-3.5 mr-2" />
                Lihat Website
              </Link>
            </Button>
            
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-[#17211B] leading-none">{user?.name || "Admin Desa"}</span>
                <span className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-widest">{user?.role || "Administrator"}</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                {(user?.name || "AD").substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* ── Page Content ───────────────────────────────────────── */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
          {children}
        </div>

      </main>
    </div>
  );
}
