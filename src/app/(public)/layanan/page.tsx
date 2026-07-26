import { FileText, ArrowRight, Clock, CheckCircle, Info } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { getCollectionData, getPageSections } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Layanan Administrasi",
  description: "Daftar layanan administrasi dan pengajuan surat online desa",
};

export const dynamic = "force-dynamic";

export default async function LayananPage() {
  const [layananSections, pengaturanBeranda] = await Promise.all([
    getPageSections("layanan"),
    getCollectionData("pengaturan-beranda"),
  ]);

  const bgImage = pengaturanBeranda.hero_background || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000";

  const layananItems = layananSections.map(({ collection, entries }, idx) => ({
    col: collection,
    data: (entries[0]?.data ?? {}) as Record<string, string>,
    idx,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">

      {/* ══════════════════════════════════════════════════════
          HERO SECTION (same style as /profil)
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[45vh] flex flex-col justify-end pt-24 pb-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Pemandangan Desa" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[#FAF9F6]" />
        </div>

        <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-1 rounded-full bg-[#A8C5B5]" />
            <span className="text-xs font-extrabold tracking-widest text-[#A8C5B5] uppercase drop-shadow">Pelayanan Publik Terpadu</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3 leading-tight drop-shadow-lg">
            Layanan Administrasi Online
          </h1>
          <p className="text-white/75 text-base md:text-lg max-w-2xl drop-shadow">
            Ajukan permohonan surat dan administrasi dengan mudah, cepat, dan transparan dari mana saja tanpa antre.
          </p>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mt-5 text-sm text-white/60">
            <Link href="/" className="hover:text-white transition-colors font-medium">Beranda</Link>
            <span>/</span>
            <span className="text-white/90 font-semibold">Layanan</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BENEFIT BADGES
      ══════════════════════════════════════════════════════ */}
      <section className="py-4">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: CheckCircle, title: "Cepat & Mudah", desc: "Proses pengajuan 100% online, tanpa antre" },
              { icon: Clock,       title: "Estimasi 3-7 Hari", desc: "Dokumen siap dalam waktu kerja normal" },
              { icon: FileText,    title: "Dokumen Digital", desc: "Terima konfirmasi langsung via WhatsApp" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#6B8E7B]/20 shadow-sm">
                <div className="h-9 w-9 rounded-xl bg-[#6B8E7B]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="h-5 w-5 text-[#6B8E7B]" />
                </div>
                <div>
                  <p className="font-bold text-[#334155] text-sm">{title}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DAFTAR LAYANAN (GRID CARD)
      ══════════════════════════════════════════════════════ */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-[#334155] tracking-tight">Daftar Layanan</h2>
            <span className="text-sm text-[#64748B] font-medium">{layananItems.length} layanan tersedia</span>
          </div>

          {layananItems.length === 0 ? (
            <div className="text-center py-24 rounded-2xl border border-dashed border-[#6B8E7B]/20 bg-white">
              <div className="h-14 w-14 rounded-2xl bg-[#FAF9F6] border border-[#6B8E7B]/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-7 w-7 text-[#6B8E7B]/30" />
              </div>
              <h3 className="text-lg font-bold text-[#334155] mb-1">Layanan Belum Tersedia</h3>
              <p className="text-[#64748B] text-sm">Admin sedang memperbarui daftar layanan.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
              {layananItems.map(({ col, data, idx }) => {
                const url = data.tautan || data.link || data.form_url || data.url || "#";
                const icons = [FileText, FileText, FileText, FileText];
                const Icon = icons[idx % icons.length];
                return (
                  <a
                    key={col.id}
                    href={url}
                    target={url !== "#" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="soft-card group p-6 flex flex-col border border-[#6B8E7B]/20 min-h-[220px] bg-gradient-to-b from-white to-[#FAF9F6] hover:border-[#6B8E7B]/50 hover:shadow-md transition-all no-underline"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <div className="h-12 w-12 rounded-full bg-[#FAF9F6] border border-[#6B8E7B]/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#6B8E7B] transition-all">
                      <Icon className="h-5 w-5 text-[#6B8E7B] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-[#334155] text-lg mb-2 leading-snug group-hover:text-[#6B8E7B] transition-colors">
                      {col.name}
                    </h3>
                    {data.deskripsi && (
                      <p className="text-sm text-[#64748B] leading-relaxed mb-4 line-clamp-2">{data.deskripsi}</p>
                    )}
                    <div className="mt-auto">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6B8E7B] text-white text-xs font-bold shadow-sm group-hover:bg-[#557162] transition-colors">
                        Mulai Buat <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          INFO BOX
      ══════════════════════════════════════════════════════ */}
      <section className="pb-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-200/60">
            <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <Info className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 mb-1">Informasi Pengambilan Berkas</h4>
              <p className="text-sm text-amber-800/80 leading-relaxed">
                Setelah mengisi formulir, tunggu konfirmasi dari pihak desa. Pengambilan berkas fisik dilayani pada{" "}
                <strong className="text-amber-900">Senin – Jumat, 08:00 – 15:00 WIB</strong> dengan membawa dokumen asli bila disyaratkan.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
