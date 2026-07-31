import { Landmark } from "lucide-react";
import { Metadata } from "next";
import { DynamicSection } from "@/components/DynamicSection";
import Link from "next/link";
import { getCollectionDataMap, getPageSections } from "@/lib/cms";
import { InteriorHero } from "@/components/layout/interior-hero";

export const metadata: Metadata = {
  title: "Profil Resmi Desa",
  description: "Sejarah, Visi, Misi, dan Struktur Wilayah Desa",
};

export const revalidate = 60;

export default async function ProfilPage() {
  const [collectionData, profilSections, dataPendudukSections] = await Promise.all([
    getCollectionDataMap(["pengaturan-beranda", "identitas-desa", "visi-desa"]),
    getPageSections("profil"),
    getPageSections("data-penduduk"),
  ]);

  const pengaturanBeranda = collectionData["pengaturan-beranda"] ?? {};
  const identitasData = collectionData["identitas-desa"] ?? {};
  const visiData = collectionData["visi-desa"] ?? {};

  const bgImage = pengaturanBeranda.interior_hero_background || pengaturanBeranda.hero_background || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000";
  const desaName = identitasData.nama_desa || "Desa";

  const visi = visiData.visi || "Terwujudnya Desa yang Maju, Mandiri, dan Sejahtera";
  const misiSection = profilSections.find(s => s.collection.slug === 'misi-desa');
  const misiPoints = misiSection?.entries.map(e => (e.data as any).poin_misi).filter(Boolean) || [];

  // Filter out visi-desa and misi-desa from dynamic sections because we render them specially
  const dynamicSections = profilSections.filter(s => s.collection.slug !== 'visi-desa' && s.collection.slug !== 'misi-desa');

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
      
      {/* ══════════════════════════════════════════════════════
          HERO SECTION (Beranda Style)
      ══════════════════════════════════════════════════════ */}
      <InteriorHero
        bgImage={bgImage}
        eyebrow="Profil Desa"
        title="Profil Resmi"
        accent={desaName}
        description="Mengenal lebih dekat visi misi, potensi, dan gambaran umum wilayah kami."
        current="Profil"
        icon={Landmark}
      />

      {/* ══════════════════════════════════════════════════════
          VISI & MISI SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white relative z-20 border-b border-[#6B8E7B]/10">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start max-w-5xl mx-auto">
            
            {/* Visi */}
            <div className="w-full lg:w-5/12 shrink-0 lg:border-r border-[#6B8E7B]/20 lg:pr-16">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6B8E7B]" />
                <span className="text-xs font-extrabold tracking-widest text-[#6B8E7B] uppercase">Visi Desa</span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-black text-[#334155] leading-snug">
                "{visi}"
              </h3>
            </div>
            
            {/* Misi */}
            <div className="w-full lg:w-7/12 pt-2 lg:pt-0">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6B8E7B]" />
                <span className="text-xs font-extrabold tracking-widest text-[#6B8E7B] uppercase">Misi Desa</span>
              </div>
              <ul className="prose-desa prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-[#6B8E7B] prose-ul:pl-6 prose-ol:pl-6 prose-li:mb-2 text-[#475569]">
                {misiPoints.length > 0 ? (
                  misiPoints.map((poin, idx) => (
                    <li key={idx} className="font-medium">{poin}</li>
                  ))
                ) : (
                  <li>Belum ada misi yang ditambahkan.</li>
                )}
              </ul>
            </div>
            
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROFIL DESA SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="py-12 relative z-20">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-[#334155] mb-2">Data Profil Desa</h2>
            <p className="text-[#64748B] text-sm max-w-2xl mx-auto">Informasi lengkap mengenai identitas, wilayah, dan potensi desa.</p>
          </div>

          {dynamicSections.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-[#6B8E7B]/20 bg-white">
              <p className="text-[#64748B] text-sm">Data profil desa belum ditambahkan.</p>
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

      {/* ══════════════════════════════════════════════════════
          DATA PENDUDUK SECTION
      ══════════════════════════════════════════════════════ */}
      {dataPendudukSections.length > 0 && (
        <section className="py-16 bg-white relative z-20 border-t border-[#6B8E7B]/10">
          <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6B8E7B]/10 text-[10px] font-extrabold text-[#6B8E7B] uppercase tracking-widest mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6B8E7B]" />
                Kependudukan
              </span>
              <h2 className="text-3xl font-black text-[#334155] mb-2">Data Penduduk & Statistik</h2>
              <p className="text-[#64748B] text-sm max-w-2xl mx-auto">Informasi dan statistik kependudukan, pekerjaan, dan demografi desa terkini.</p>
            </div>

            <div className="columns-1 md:columns-2 xl:columns-3 gap-6 lg:gap-8 space-y-6 lg:space-y-8">
              {dataPendudukSections.map((section, i) => (
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
          </div>
        </section>
      )}

    </div>
  );
}
