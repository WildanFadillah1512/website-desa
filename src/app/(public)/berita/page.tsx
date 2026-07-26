import Link from "next/link";
import { Calendar, Newspaper, ArrowRight, Clock } from "lucide-react";
import { Metadata } from "next";
import { InteriorHero } from "@/components/layout/interior-hero";
import { getCollectionDataMap, getPublishedNews } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Berita & Pengumuman",
  description: "Berita terbaru, pengumuman, dan informasi terkini dari Desa.",
};

export const revalidate = 60;

export default async function BeritaPage() {
  const [newsList, collectionData] = await Promise.all([
    getPublishedNews(),
    getCollectionDataMap(["pengaturan-beranda"]),
  ]);

  const pengaturanBeranda = collectionData["pengaturan-beranda"] ?? {};
  const bgImage =
    pengaturanBeranda.interior_hero_background ||
    pengaturanBeranda.hero_background ||
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000";

  const featured = newsList[0];
  const rest     = newsList.slice(1);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <InteriorHero
        bgImage={bgImage}
        icon={Newspaper}
        eyebrow="Informasi Publik"
        title="Berita & Pengumuman"
        description="Informasi terkini, pengumuman, dan kabar kegiatan langsung dari pemerintah desa."
        current="Berita"
      />

      <div className="bg-[#FAF9F6]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">

          {newsList.length === 0 ? (
            <div className="text-center py-28 rounded-2xl border border-dashed border-[#6B8E7B]/20 bg-white">
              <div className="h-16 w-16 rounded-2xl bg-[#FAF9F6] border border-[#6B8E7B]/10 shadow-sm flex items-center justify-center mx-auto mb-5">
                <Newspaper className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-[#334155] mb-2">Belum Ada Berita</h3>
              <p className="text-slate-400 text-sm">Berita akan segera dipublikasikan.</p>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featured && (
                <Link
                  href={`/berita/${featured.slug}`}
                  className="group mb-12 grid gap-0 overflow-hidden rounded-2xl border border-[#6B8E7B]/15 bg-white shadow-sm transition-all duration-300 hover:border-[#166534]/25 hover:shadow-xl lg:grid-cols-2"
                >
                  {/* Image */}
                  <div className="relative h-60 lg:h-auto overflow-hidden bg-slate-100">
                    {featured.thumbnailUrl ? (
                      <img
                        src={featured.thumbnailUrl}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0B1E12] to-[#166534]">
                        <Newspaper className="h-16 w-16 text-white/20" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-[#166534] text-white text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
                        Terbaru
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-10 flex flex-col justify-center bg-white">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-4">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <time dateTime={featured.publishedAt?.toISOString()}>
                        {featured.publishedAt
                          ? new Date(featured.publishedAt).toLocaleDateString("id-ID", {
                              day: "numeric", month: "long", year: "numeric",
                            })
                          : "—"}
                      </time>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-black text-[#334155] leading-tight tracking-tight mb-4 group-hover:text-[#166534] transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {featured.content.replace(/<[^>]*>?/gm, "").substring(0, 200)}...
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#166534] group-hover:gap-3 transition-all">
                      Baca Selengkapnya
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <>
                  <h3 className="text-lg font-black text-[#334155] mb-6 tracking-tight">Berita Lainnya</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((item, i) => (
                      <Link
                        key={item.id}
                        href={`/berita/${item.slug}`}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-[#6B8E7B]/15 bg-white shadow-sm no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[#166534]/25 hover:shadow-lg animate-fade-in-up"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        {/* Thumbnail */}
                        <div className="relative h-44 overflow-hidden bg-slate-100">
                          {item.thumbnailUrl ? (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
                              <Newspaper className="h-10 w-10 text-slate-200" />
                            </div>
                          )}
                        </div>

                        {/* Body */}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-3">
                            <Clock className="h-3 w-3 shrink-0" />
                            <time dateTime={item.publishedAt?.toISOString()}>
                              {item.publishedAt
                                ? new Date(item.publishedAt).toLocaleDateString("id-ID", {
                                    day: "numeric", month: "short", year: "numeric",
                                  })
                                : "—"}
                            </time>
                          </div>
                          <h3 className="font-bold text-[#334155] text-base leading-snug mb-3 line-clamp-2 flex-1 group-hover:text-[#166534] transition-colors">
                            {item.title}
                          </h3>
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-[#166534]">
                            <span>Baca</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
