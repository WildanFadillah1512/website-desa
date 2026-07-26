import { GraduationCap, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { DynamicSection } from "@/components/DynamicSection";
import Link from "next/link";
import { getCollectionData, getPageSections } from "@/lib/cms";
import { InteriorHero } from "@/components/layout/interior-hero";

export const metadata: Metadata = {
  title: "EduVillage",
  description: "Portal pendidikan, beasiswa, dan direktori kampus untuk masyarakat desa",
};

export const dynamic = "force-dynamic";

export default async function EduVillagePage() {
  const [dynamicSections, pengaturanBeranda] = await Promise.all([
    getPageSections("eduvillage"),
    getCollectionData("pengaturan-beranda"),
  ]);

  const bgImage = pengaturanBeranda.interior_hero_background || pengaturanBeranda.hero_background || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000";

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">

      {/* ══════════════════════════════════════════════════════
          HERO SECTION (Beranda Style)
      ══════════════════════════════════════════════════════ */}
      <InteriorHero
        bgImage={bgImage}
        eyebrow="Pendidikan & Beasiswa"
        title="EduVillage"
        description="Portal informasi pendidikan, direktori kampus, dan program beasiswa untuk generasi muda desa."
        current="EduVillage"
        icon={GraduationCap}
      />

      {/* ══════════════════════════════════════════════════════
          MASONRY CONTENT SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="py-12 relative z-20">
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {dynamicSections.length === 0 ? (
            <div className="text-center py-24 rounded-2xl border border-dashed border-[#6B8E7B]/20 bg-white">
              <div className="h-16 w-16 rounded-2xl bg-[#FAF9F6] border border-[#6B8E7B]/10 flex items-center justify-center mx-auto mb-5">
                <GraduationCap className="h-8 w-8 text-[#6B8E7B]/50" />
              </div>
              <h3 className="text-xl font-bold text-[#334155] mb-2">Konten Belum Tersedia</h3>
              <p className="text-[#64748B] text-sm mb-6">Informasi pendidikan belum ditambahkan.</p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6B8E7B] text-white font-bold text-sm hover:bg-[#557162] transition-colors"
              >
                Tambah via Admin <ArrowRight className="h-4 w-4" />
              </Link>
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
