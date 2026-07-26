import { Landmark } from "lucide-react";
import { Metadata } from "next";
import { DynamicSection } from "@/components/DynamicSection";
import Link from "next/link";
import { getCollectionDataMap, getPageSections } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Profil Resmi Desa",
  description: "Sejarah, Visi, Misi, dan Struktur Wilayah Desa",
};

export const revalidate = 60;

export default async function ProfilPage() {
  const [collectionData, dynamicSections] = await Promise.all([
    getCollectionDataMap(["pengaturan-beranda", "identitas-desa"]),
    getPageSections("profil"),
  ]);

  const pengaturanBeranda = collectionData["pengaturan-beranda"] ?? {};
  const identitasData = collectionData["identitas-desa"] ?? {};

  const bgImage = pengaturanBeranda.hero_background || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000";
  const desaName = identitasData.nama_desa || "Desa";

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
      
      {/* ══════════════════════════════════════════════════════
          HERO SECTION (Beranda Style)
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Pemandangan Desa" className="w-full h-full object-cover object-center" />
          {/* Gradient Overlay for soft contrast (Darker at top for header, soft ivory at bottom) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-[#FAF9F6]" />
        </div>

        <div className="relative z-10 section-container text-left w-full max-w-6xl mx-auto mt-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
            Profil Resmi <br className="md:hidden" />
            <span className="text-[#A8C5B5]">{desaName}</span>
          </h1>
          
          <p className="text-base md:text-lg text-white/75 font-medium max-w-2xl drop-shadow">
            Mengenal lebih dekat visi misi, potensi, dan gambaran umum wilayah kami.
          </p>

          <div className="flex items-center gap-2 mt-6 text-sm text-white/60">
            <a href="/" className="hover:text-white transition-colors font-medium">Beranda</a>
            <span>/</span>
            <span className="text-white/90 font-semibold">Profil</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MASONRY CONTENT SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="py-12 relative z-20">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {dynamicSections.length === 0 ? (
            <div className="text-center py-24 rounded-2xl border border-dashed border-[#6B8E7B]/20 bg-white">
              <div className="h-16 w-16 rounded-2xl bg-[#FAF9F6] border border-[#6B8E7B]/10 flex items-center justify-center mx-auto mb-5">
                <Landmark className="h-8 w-8 text-[#6B8E7B]/50" />
              </div>
              <h3 className="text-xl font-bold text-[#334155] mb-2">Profil Belum Diisi</h3>
              <p className="text-[#64748B] text-sm">
                Data profil desa belum ditambahkan.{" "}
                <Link href="/admin" className="text-[#6B8E7B] font-bold hover:underline">
                  Tambahkan lewat Panel Admin
                </Link>
              </p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 xl:columns-3 gap-6 lg:gap-8 space-y-6 lg:space-y-8">
              {dynamicSections.map((section, i) => (
                <div
                  key={section.collection.id}
                  className="break-inside-avoid animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <DynamicSection
                    collection={section.collection}
                    fields={section.fields}
                    entries={section.entries}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
