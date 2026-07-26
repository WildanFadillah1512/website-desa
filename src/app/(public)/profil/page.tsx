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
  const [collectionData, dynamicSections] = await Promise.all([
    getCollectionDataMap(["pengaturan-beranda", "identitas-desa"]),
    getPageSections("profil"),
  ]);

  const pengaturanBeranda = collectionData["pengaturan-beranda"] ?? {};
  const identitasData = collectionData["identitas-desa"] ?? {};

  const bgImage = pengaturanBeranda.interior_hero_background || pengaturanBeranda.hero_background || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000";
  const desaName = identitasData.nama_desa || "Desa";

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
