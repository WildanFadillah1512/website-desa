import Link from "next/link";
import { Mail, MapPin, Phone, ArrowUpRight, ExternalLink } from "lucide-react";

interface FooterProps {
  desaName: string;
  logo: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kontak: Record<string, string>;
}

export default function Footer({
  desaName,
  logo,
  kecamatan,
  kabupaten,
  provinsi,
  kontak,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#ffffff] text-[#334155] pt-20 pb-10 border-t border-[#6B8E7B]/10 overflow-hidden mt-auto">
      
      {/* ── Decorative Leaf SVG (Bottom Left) ── */}
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-5 pointer-events-none transform -translate-x-1/4 translate-y-1/4 text-[#6B8E7B]">
        <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 100c0 0-40-20-40-60C10 10 30 0 50 0s40 10 40 40c0 40-40 60-40 60z" />
          <path d="M50 100V0" stroke="white" strokeWidth="2" fill="none" />
          <path d="M50 50L20 30M50 70L20 50M50 30L80 50M50 50L80 70" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-16">
          
          {/* ── 1. Brand Column ── */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              {logo ? (
                <div className="h-14 w-14 rounded-2xl bg-[#FAF9F6] p-2 flex items-center justify-center border border-[#6B8E7B]/10">
                  <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="h-14 w-14 rounded-2xl bg-[#6B8E7B] flex items-center justify-center text-white font-bold text-xl shadow-sm">
                  {desaName.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-[#334155] group-hover:text-[#6B8E7B] transition-colors">
                  {desaName}
                </h3>
                <p className="text-[10px] font-bold text-[#64748B] tracking-widest uppercase mt-0.5">
                  {kecamatan}, {kabupaten}
                </p>
              </div>
            </Link>
            <p className="text-[#64748B] leading-relaxed text-sm max-w-sm mb-6">
              Portal informasi resmi dan layanan publik {desaName}. Mewujudkan desa yang religius, mandiri, dan sejahtera untuk seluruh masyarakat.
            </p>
            <div className="flex items-center gap-3">
              {kontak.facebook && (
                <a href={kontak.facebook} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-[#FAF9F6] border border-[#6B8E7B]/10 flex items-center justify-center text-[#64748B] hover:text-[#6B8E7B] hover:border-[#6B8E7B] transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
              {kontak.instagram && (
                <a href={kontak.instagram} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-[#FAF9F6] border border-[#6B8E7B]/10 flex items-center justify-center text-[#64748B] hover:text-[#6B8E7B] hover:border-[#6B8E7B] transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              )}
              {kontak.youtube && (
                <a href={kontak.youtube} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-[#FAF9F6] border border-[#6B8E7B]/10 flex items-center justify-center text-[#64748B] hover:text-[#6B8E7B] hover:border-[#6B8E7B] transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.1 8.4 2 10.2 2 12s.1 3.6.5 4.9a3.1 3.1 0 0 0 2.2 2.2C6 19.5 12 19.5 12 19.5s6 0 7.3-.4a3.1 3.1 0 0 0 2.2-2.2c.4-1.3.5-3.1.5-4.9s-.1-3.6-.5-4.9a3.1 3.1 0 0 0-2.2-2.2C18 4.5 12 4.5 12 4.5s-6 0-7.3.4a3.1 3.1 0 0 0-2.2 2.2z"/><path d="M9.7 15.6V8.4l5.9 3.6-5.9 3.6z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* ── 2. Akses Cepat ── */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-extrabold tracking-widest text-[#334155] uppercase mb-6">Akses Cepat</h4>
            <ul className="space-y-3">
              {[
                { label: "Profil & Sejarah Desa", href: "/profil" },
                { label: "Data Kependudukan", href: "/data-penduduk" },
                { label: "Layanan Administrasi", href: "/layanan" },
                { label: "EduVillage (Pendidikan)", href: "/eduvillage" },
                { label: "Berita & Pengumuman", href: "/berita" },
                { label: "Pengaduan Masyarakat", href: "/pengaduan" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm font-medium text-[#64748B] hover:text-[#6B8E7B] flex items-center gap-2 group transition-colors">
                    <span className="h-1 w-1 rounded-full bg-[#64748B] group-hover:bg-[#6B8E7B] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── 3. Kontak ── */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-extrabold tracking-widest text-[#334155] uppercase mb-6">Kontak</h4>
            <ul className="space-y-4">
              {kontak.alamat && (
                <li className="flex items-start gap-3 text-[#64748B] text-sm group">
                  <MapPin className="h-4 w-4 text-[#6B8E7B] shrink-0 mt-1" />
                  <span className="leading-relaxed">{kontak.alamat}</span>
                </li>
              )}
              {kontak.telepon && (
                <li className="flex items-center gap-3 text-[#64748B] text-sm group">
                  <Phone className="h-4 w-4 text-[#6B8E7B] shrink-0" />
                  <a href={`tel:${kontak.telepon}`} className="hover:text-[#6B8E7B] transition-colors">{kontak.telepon}</a>
                </li>
              )}
              {kontak.email && (
                <li className="flex items-center gap-3 text-[#64748B] text-sm group">
                  <Mail className="h-4 w-4 text-[#6B8E7B] shrink-0" />
                  <a href={`mailto:${kontak.email}`} className="hover:text-[#6B8E7B] transition-colors">{kontak.email}</a>
                </li>
              )}
              <li className="flex items-center gap-3 text-[#64748B] text-sm group">
                <div className="h-4 w-4 flex items-center justify-center shrink-0">
                  <div className="h-2 w-2 rounded-full border-2 border-[#6B8E7B]" />
                </div>
                <span>Senin - Jumat, 08:00 - 15:00 WIB</span>
              </li>
            </ul>
          </div>

          {/* ── 4. Lokasi Kantor (Map) ── */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-extrabold tracking-widest text-[#334155] uppercase mb-6">Lokasi Kantor</h4>
            <div className="w-full aspect-[4/3] rounded-2xl bg-[#FAF9F6] border border-[#6B8E7B]/10 overflow-hidden relative group cursor-pointer">
              {/* Map placeholder pattern */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #6B8E7B 0, #6B8E7B 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-[#6B8E7B]" />
              </div>
              <div className="absolute inset-0 bg-[#6B8E7B]/0 group-hover:bg-[#6B8E7B]/5 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white px-3 py-1.5 rounded-full text-xs font-bold text-[#6B8E7B] shadow-sm flex items-center gap-1.5 transition-all transform translate-y-2 group-hover:translate-y-0">
                  Buka Maps <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 border-t border-[#6B8E7B]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-[#64748B]">
          <div className="text-center md:text-left">
            &copy; {currentYear} Pemerintah {desaName}. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-[#6B8E7B] transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-[#6B8E7B] transition-colors">Syarat & Ketentuan</Link>
            <span className="text-slate-300">v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
