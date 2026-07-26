import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, ArrowRight, Share2, Newspaper } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import { getNewsBySlug, getLatestNews } from "@/lib/cms";

export const revalidate = 60;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: "Berita Tidak Ditemukan" };
  return {
    title: article.title,
    description: article.content.replace(/<[^>]*>?/gm, "").substring(0, 160),
    openGraph: article.thumbnailUrl ? { images: [article.thumbnailUrl] } : undefined,
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article || article.status !== "published") notFound();

  const related = await getLatestNews(4);
  const relatedFiltered = related.filter((r) => r.id !== article.id).slice(0, 3);

  const publishedDate = article.publishedAt || article.createdAt;

  return (
    <div className="bg-white min-h-screen">
      {/* ── Page Header ─────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#0B1E12]">
        <div aria-hidden className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #4ade80 1px, transparent 0)`, backgroundSize: "32px 32px" }} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B1E12]" />

        <div className="relative z-10 container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-10 pb-10">
          {/* Back button */}
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors mb-8 group"
          >
            <div className="h-7 w-7 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </div>
            Kembali ke Berita
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-white/40 font-medium mb-4">
            <span className="px-2.5 py-1 rounded-full bg-[#166534]/40 border border-[#4ade80]/15 text-[#4ade80] text-[10px] font-extrabold uppercase tracking-widest">
              Informasi Publik
            </span>
            <span>·</span>
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={publishedDate.toISOString()}>
              {new Date(publishedDate).toLocaleDateString("id-ID", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </time>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-white leading-[1.1] tracking-tight">
            {article.title}
          </h1>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#166534]/50 to-transparent" />
      </div>

      {/* ── Article Body ─────────────────────────────── */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* Thumbnail */}
        {article.thumbnailUrl && (
          <div className="mb-12 rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-[16/7]">
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose-desa animate-fade-in-up">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Share bar */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between gap-4">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Semua Berita
          </Link>
          <button
            type="button"
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.share) {
                navigator.share({ title: article.title, url: window.location.href });
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-sm font-semibold"
          >
            <Share2 className="h-4 w-4" />
            Bagikan
          </button>
        </div>
      </div>

      {/* ── Related Articles ─────────────────────────── */}
      {relatedFiltered.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Berita Lainnya</h2>
              <Link href="/berita" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#166534] hover:text-[#14532d] transition-colors">
                Lihat Semua <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedFiltered.map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="group card flex flex-col overflow-hidden no-underline"
                >
                  <div className="h-40 overflow-hidden bg-slate-100">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
                        <Newspaper className="h-8 w-8 text-slate-200" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs text-slate-400 mb-2">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </p>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-[#166534] transition-colors flex-1">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
