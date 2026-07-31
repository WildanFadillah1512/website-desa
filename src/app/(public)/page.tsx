import Link from "next/link";
import {
  ArrowRight, Users, Map, Building, Home as HomeIcon,
  FileText, Clock, FileDigit, Landmark, Calculator, PenTool,
  CheckCircle, Hand
} from "lucide-react";
import { getCollectionDataMap, getLatestNews, getPageSections } from "@/lib/cms";

// ── Data fetchers ────────────────────────────────────────────
export const revalidate = 60;

// ── Page ────────────────────────────────────────────────────
export default async function Home() {
  const [latestNews, collectionData, layananSections, profilSections] = await Promise.all([
    getLatestNews(3),
    getCollectionDataMap([
      "identitas-desa",
      "informasi-wilayah",
      "sambutan-kepala-desa",
      "pengaturan-beranda",
      "visi-desa",
    ]),
    getPageSections("layanan"),
    getPageSections("profil"),
  ]);

  const identitasData = collectionData["identitas-desa"] ?? {};
  const wilayahData = collectionData["informasi-wilayah"] ?? {};
  const sambutanData = collectionData["sambutan-kepala-desa"] ?? {};
  const pengaturanBeranda = collectionData["pengaturan-beranda"] ?? {};
  const visiData = collectionData["visi-desa"] ?? {};
  
  const misiSection = profilSections.find(s => s.collection.slug === 'misi-desa');
  const misiPoints = misiSection?.entries.map(e => (e.data as any).poin_misi).filter(Boolean) || [];

  const layananItems = layananSections.map(({ collection, entries }) => ({
    col: collection,
    data: (entries[0]?.data ?? {}) as Record<string, string>,
  }));

  // ── Derived values ──────────────────────────────────────
  const desaName      = identitasData.nama_desa || "Desa";
  const kecamatan     = identitasData.kecamatan || "Kecamatan";
  const kabupaten     = identitasData.kabupaten || "Kabupaten";
  const heroSlogan    = identitasData.slogan    || `Mewujudkan desa yang religius, mandiri, dan sejahtera untuk seluruh masyarakat.`;
  const bgImage       = pengaturanBeranda.home_hero_background || pengaturanBeranda.hero_background || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000";

  const sambutanJudul   = sambutanData.judul            || `Bersama Membangun ${desaName} yang Lebih Baik`;
  const sambutanIsi     = sambutanData.isi_sambutan     || "Pemerintah desa berkomitmen penuh untuk memberikan layanan publik yang transparan, cepat, dan mudah diakses. Website ini hadir sebagai wujud nyata inovasi digital untuk mendekatkan pelayanan kepada seluruh warga masyarakat.";
  const sambutanNama    = sambutanData.nama_kepala_desa || "Kepala Desa";
  const sambutanJabatan = sambutanData.jabatan          || `Kepala ${desaName}`;
  const sambutanFoto    = sambutanData.foto_url         || "";

  const statPenduduk = identitasData.jumlah_penduduk || "1.240";
  const statKK       = identitasData.jumlah_kk       || "450";
  const statLuas     = wilayahData.luas_wilayah      || "200";
  const statRW       = wilayahData.jumlah_rw         || "12";

  const visi = visiData.visi || "Terwujudnya Desa yang Maju, Mandiri, dan Sejahtera";

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* ══════════════════════════════════════════════════════
          SECTION 1: HERO (Classic Full Width)
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Pemandangan Desa" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,12,20,0.68)_0%,rgba(4,12,20,0.28)_42%,rgba(250,249,246,0.96)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,24,16,0.34)_0%,rgba(7,24,16,0.24)_38%,rgba(7,24,16,0.04)_68%)]" />
        </div>

        <div className="relative z-10 section-container text-center w-full max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-white uppercase tracking-widest mb-8 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A8C5B5] animate-pulse" />
            Portal Resmi {desaName}
          </div>
          
          <h1 className="hero-readable-title text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            Selamat Datang <br />
            <span className="text-[#C8DDCF]">{desaName}</span>
          </h1>
          
          <p className="hero-readable-copy text-lg md:text-xl font-semibold max-w-2xl mx-auto mb-10">
            {kecamatan} · {kabupaten}
            <br className="hidden sm:block" />
            {heroSlogan}
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link href="/layanan" className="btn-primary">
              Layanan Publik <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/profil" className="btn-secondary bg-white/50 backdrop-blur-md">
              Profil Desa
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 1.5: VISI MISI
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#FAF9F6] relative z-20">
        <div className="section-container">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            
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
              <ul className="list-disc marker:text-[#6B8E7B] pl-6 space-y-2 text-[#475569]">
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
          SECTION 2: LAYANAN & BERITA
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 relative z-20">
        <div className="section-container">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            
            {/* Left: Layanan (Grid 2x2) */}
            <div className="lg:col-span-7">
              <div className="mb-8">
                <span className="text-xs font-extrabold tracking-widest text-[#6B8E7B] uppercase">Layanan Administrasi</span>
                <h2 className="text-3xl font-black text-[#334155] mt-2 mb-3">Layanan Publik Digital</h2>
                <p className="text-[#64748B] text-sm">Akses berbagai layanan administrasi surat menyurat dengan lebih mudah dan cepat.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {layananItems.length === 0 ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="soft-card p-6 flex flex-col items-center justify-center text-center opacity-60 min-h-[220px]">
                      <FileDigit className="h-10 w-10 text-[#6B8E7B]/30 mb-3" />
                      <div className="h-4 w-2/3 bg-slate-100 rounded mb-2" />
                      <div className="h-3 w-1/2 bg-slate-50 rounded" />
                    </div>
                  ))
                ) : (
                  layananItems.slice(0, 4).map(({ col, data }, idx) => {
                    const icons = [FileText, Landmark, Calculator, PenTool];
                    const Icon = icons[idx % icons.length];
                    const url = data.tautan || data.link || data.form_url || "/layanan";
                    return (
                      <a key={col.id} href={url} target="_blank" rel="noopener noreferrer" className="soft-card group p-6 flex flex-col border border-[#6B8E7B]/20 min-h-[220px] bg-gradient-to-b from-white to-[#FAF9F6] no-underline">
                        <div className="h-12 w-12 rounded-full bg-[#FAF9F6] border border-[#6B8E7B]/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#6B8E7B] transition-all">
                          <Icon className="h-5 w-5 text-[#6B8E7B] group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="font-bold text-[#334155] text-lg mb-2 leading-snug group-hover:text-[#6B8E7B] transition-colors">
                          {col.name}
                        </h3>
                        <div className="mt-auto">
                          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#6B8E7B] text-white text-xs font-bold shadow-sm group-hover:bg-[#557162] transition-colors">
                            Mulai Buat <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </a>
                    );
                  })
                )}
              </div>
              <div className="mt-8 flex justify-center">
                <Link href="/layanan" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white border border-[#6B8E7B]/30 text-[#334155] font-bold shadow-sm hover:bg-[#FAF9F6] hover:border-[#6B8E7B]/50 hover:text-[#6B8E7B] transition-all">
                  Lihat Semua Layanan <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right: Berita (3 Horizontal Stack) */}
            <div className="lg:col-span-5">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="text-xs font-extrabold tracking-widest text-[#6B8E7B] uppercase">Informasi Desa</span>
                  <h2 className="text-3xl font-black text-[#334155] mt-2">Kabar Terbaru</h2>
                </div>
                <Link href="/berita" className="px-4 py-1.5 rounded-full bg-[#6B8E7B] text-white text-xs font-bold hover:bg-[#557162] transition-colors shadow-sm hidden sm:block">
                  Lihat Semua
                </Link>
              </div>
              <p className="text-[#64748B] text-sm mb-6 hidden lg:block">Ikuti perkembangan dan informasi terkini seputar kegiatan pemerintah desa.</p>

              <div className="flex flex-col gap-4">
                {latestNews.length === 0 ? (
                  <div className="soft-card p-8 text-center bg-white/50 text-[#64748B] text-sm">Belum ada berita.</div>
                ) : (
                  latestNews.map((post) => (
                    <Link key={post.id} href={`/berita/${post.slug}`} className="soft-card group flex items-start gap-4 p-4 hover:bg-white bg-white/50">
                      <div className="w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-[#6B8E7B]/10">
                        {post.thumbnailUrl && (
                          <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                      </div>
                      <div className="flex flex-col h-full py-1">
                        <h3 className="font-bold text-[#334155] leading-snug line-clamp-2 group-hover:text-[#6B8E7B] transition-colors mb-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-[#64748B] line-clamp-2 mb-auto">
                          {post.content.replace(/<[^>]*>?/gm, "")}
                        </p>
                        <span className="text-[10px] font-bold text-[#6B8E7B] uppercase tracking-widest mt-2">
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3: SAMBUTAN KEPALA DESA
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white relative">
        {/* Soft Background Wave/Blob */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-[#FAF9F6] to-white pointer-events-none" />
        
        <div className="section-container relative z-10">
          <div className="grid md:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left: Photo */}
            <div className="md:col-span-5 relative">
              <div className="absolute -inset-4 bg-[#6B8E7B]/5 rounded-[2.5rem] -rotate-3" />
              <div className="relative soft-card overflow-hidden rounded-[2rem] aspect-[4/5] bg-[#FAF9F6]">
                {sambutanFoto ? (
                  <img src={sambutanFoto} alt={sambutanNama} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="h-20 w-20 text-[#6B8E7B]/20" />
                  </div>
                )}
                {/* Name Plate */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-sm border border-[#6B8E7B]/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#334155]">{sambutanNama}</p>
                    <p className="text-xs text-[#6B8E7B] font-medium">{sambutanJabatan}</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-[#6B8E7B]" />
                </div>
              </div>
            </div>

            {/* Right: Text */}
            <div className="md:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6B8E7B]/10 text-[10px] font-extrabold text-[#6B8E7B] uppercase tracking-widest mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6B8E7B]" />
                Sambutan Kepala Desa
              </span>
              <h2 className="text-4xl lg:text-5xl font-black text-[#334155] leading-tight mb-8">
                {sambutanJudul}
              </h2>
              
              <div className="border-l-4 border-[#6B8E7B] pl-6 py-2 mb-8 relative">
                <p className="text-[#64748B] text-lg leading-relaxed italic relative z-10">
                  {sambutanIsi}
                </p>
              </div>

              <Link href="/profil" className="inline-flex items-center gap-2 text-sm font-bold text-[#6B8E7B] hover:text-[#557162] group">
                Selengkapnya tentang desa
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4: STATISTIK (Wide Cards Grid)
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#FAF9F6]">
        <div className="section-container">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold tracking-widest text-[#6B8E7B] uppercase">Gambaran Desa</span>
            <h2 className="text-3xl font-black text-[#334155] mt-2">Statistik {desaName}</h2>
            <p className="text-[#64748B] text-sm mt-2">Data kependudukan wilayah terkini</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: "PENDUDUK", value: statPenduduk, icon: Users },
              { label: "KELUARGA", value: statKK, icon: Building },
              { label: "LUAS WILAYAH (Ha)", value: statLuas, icon: Map },
              { label: "RUKUN WARGA", value: statRW, icon: HomeIcon },
            ].map((stat, i) => (
              <div key={i} className="soft-card p-0 flex flex-row items-center border border-[#6B8E7B]/20 overflow-hidden group">
                {/* Icon Left Area */}
                <div className="w-1/3 bg-[#557162] h-full p-8 flex items-center justify-center relative overflow-hidden group-hover:bg-[#6B8E7B] transition-colors">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '12px 12px' }} />
                  <stat.icon className="h-12 w-12 text-white relative z-10" />
                </div>
                {/* Value Area */}
                <div className="w-2/3 p-8 flex flex-col justify-center bg-white relative">
                  <span className="text-5xl font-black text-[#334155] mb-2">{stat.value}</span>
                  <span className="text-xs font-extrabold text-[#64748B] tracking-widest uppercase">{stat.label}</span>
                  
                  {/* Decorative faint element on right */}
                  <div className="absolute right-0 top-0 bottom-0 w-24 overflow-hidden pointer-events-none">
                     <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-[20px] border-[#FAF9F6]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 5: PENGADUAN (Soft Box with Leaf Decor)
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Soft Leaf SVGs on Edges */}
        <div className="absolute top-0 left-0 h-full opacity-10 text-[#6B8E7B] pointer-events-none transform -translate-x-1/2">
          <svg height="100%" viewBox="0 0 200 400" preserveAspectRatio="none" fill="currentColor"><path d="M100 400c0 0-80-80-80-200S100 0 100 0s80 40 80 200-80 200-80 200z"/></svg>
        </div>
        <div className="absolute top-0 right-0 h-full opacity-10 text-[#6B8E7B] pointer-events-none transform translate-x-1/2 scale-x-[-1]">
          <svg height="100%" viewBox="0 0 200 400" preserveAspectRatio="none" fill="currentColor"><path d="M100 400c0 0-80-80-80-200S100 0 100 0s80 40 80 200-80 200-80 200z"/></svg>
        </div>
        
        {/* Very soft central gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FAF9F6] to-transparent pointer-events-none" />

        <div className="section-container relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#334155] mb-4">Ada Keluhan atau<br />Pengaduan?</h2>
          <p className="text-[#64748B] text-sm max-w-lg mx-auto mb-10">Sampaikan aspirasi dan keluhan Anda secara langsung kepada pemerintah desa. Kami siap mendengar dan menindaklanjuti.</p>
          
          <div className="max-w-2xl mx-auto soft-card bg-white p-8 md:p-12 border border-[#6B8E7B]/20 flex flex-col sm:flex-row items-center gap-8 justify-between">
            <div className="flex-1 flex justify-center sm:justify-start">
              <div className="h-32 w-32 rounded-full bg-[#FAF9F6] border border-[#6B8E7B]/10 flex items-center justify-center">
                <Hand className="h-12 w-12 text-[#6B8E7B]" />
              </div>
            </div>
            
            <div className="flex flex-col gap-4 w-full sm:w-auto min-w-[200px]">
              <Link href="/pengaduan" className="btn-primary w-full justify-between px-6">
                Buat Pengaduan <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/layanan" className="btn-secondary w-full justify-between px-6 bg-white">
                Layanan Lainnya <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
