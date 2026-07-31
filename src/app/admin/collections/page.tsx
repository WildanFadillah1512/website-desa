export const dynamic = 'force-dynamic';

import { db } from "@/db";
import { contentCollections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Settings2, Trash2, Layout, Database, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { invalidateCmsCache } from "@/lib/cms";

const PAGE_LABELS: Record<string, string> = {
  beranda: "Beranda (/)",
  profil: "Profil (/profil)",
  layanan: "Layanan (/layanan)",
  eduvillage: "EduVillage (/eduvillage)",
  "data-penduduk": "Data Penduduk (/data-penduduk)",
  umum: "Umum / Global",
};

const systemCollections = [
  'identitas-desa',
  'informasi-wilayah',
  'sambutan-kepala-desa',
  'pengaturan-beranda',
  'visi-desa',
  'misi-desa',
  'kontak-desa',
  'layanan-desa',
  'profil-desa',
  'daftar-beasiswa',
  'daftar-pts',
  'data-pekerjaan',
  'kampus',
  'layanan-pengantar-skck',
  'layanan-keterangan-domisili',
  'layanan-keterangan-tidak-mampu',
  'layanan-pengantar-ktp-kk'
];

const LOCKED_DELETE_SLUGS = [
  'identitas-desa',
  'informasi-wilayah',
  'sambutan-kepala-desa',
  'pengaturan-beranda',
  'visi-desa',
  'misi-desa',
  'kontak-desa',
  'layanan-pengantar-skck',
  'layanan-keterangan-domisili',
  'layanan-keterangan-tidak-mampu',
  'layanan-pengantar-ktp-kk'
];

const LOCKED_FIELDS_SLUGS = [
  'sambutan-kepala-desa',
  'profil-desa',
  'visi-desa',
  'misi-desa',
  'surat-keterangan-usaha',
  'surat-keterangan-tidak-mampu',
  'surat-pengantar-nikah',
  'kontak-desa',
  'pengaturan-beranda',
  'layanan-pengantar-skck',
  'layanan-keterangan-domisili',
  'layanan-keterangan-tidak-mampu',
  'layanan-pengantar-ktp-kk'
];

export default async function CollectionsPage() {
  const collections = await db.select().from(contentCollections).orderBy(contentCollections.createdAt);

  async function deleteCollection(formData: FormData) {
    "use server";
    const colId = parseInt(formData.get("colId") as string, 10);
    if (!colId) return;
    await db.delete(contentCollections).where(eq(contentCollections.id, colId));
    invalidateCmsCache();
    revalidatePath("/admin/collections");
    revalidateTag("cms", "max");
  }

  const grouped = collections.reduce((acc, col) => {
    const page = col.page || 'umum';
    if (!acc[page]) acc[page] = [];
    acc[page].push(col);
    return acc;
  }, {} as Record<string, typeof collections>);

  const orderedPages = [
    "beranda",
    "profil",
    "layanan",
    "eduvillage",
    "data-penduduk"
  ].filter(p => grouped[p]?.length > 0);

  return (
    <div className="space-y-6">

      {/* ── Header ───────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">Dynamic Page Builder</h1>
        <p className="text-slate-500 mt-1">Kelola komponen data per halaman yang dirender otomatis di halaman publik.</p>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      {orderedPages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center animate-fade-in-up">
          <Database className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#0f172a] mb-2">Belum ada komponen</h3>
          <p className="text-slate-500 max-w-md mx-auto">Komponen akan muncul di sini secara otomatis saat seed data dijalankan.</p>
        </div>
      ) : (
        <div className="grid gap-6 animate-fade-in-up">
          {orderedPages.map((pageName) => {
            const cols = grouped[pageName];
            return (
              <Card key={pageName} className="overflow-hidden border border-[#6B8E7B]/10 shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl mb-8">
                {/* Group Header */}
                <div className="bg-gradient-to-r from-[#FAF9F6] to-white px-6 py-5 border-b border-[#6B8E7B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white border border-[#6B8E7B]/20 shadow-sm flex items-center justify-center shrink-0">
                      <Layout className="h-6 w-6 text-[#6B8E7B]" />
                    </div>
                    <div>
                      <h3 className="font-black text-[#334155] text-lg flex items-center gap-2 tracking-tight">
                        {PAGE_LABELS[pageName] || pageName}
                      </h3>
                      <p className="text-sm font-medium text-[#64748B] mt-0.5">{cols.length} komponen aktif</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-white border-[#6B8E7B]/20 text-[#334155] hover:bg-[#6B8E7B] hover:text-white transition-colors shrink-0 rounded-xl">
                    <Link href={`/admin/collections/new?page=${pageName}`} className="flex items-center">
                      <Plus className="mr-1.5 h-4 w-4" />
                      Tambah Komponen
                    </Link>
                  </Button>
                </div>

                {/* List */}
                <CardContent className="p-0">
                  <div className="divide-y divide-[#6B8E7B]/5">
                    {cols.map((col) => (
                      <div key={col.id} className="relative grid grid-cols-1 md:grid-cols-12 gap-4 p-5 md:pl-8 items-center hover:bg-[#FAF9F6] transition-all duration-300 group">
                        
                        {/* Hover Indicator */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6B8E7B] opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="md:col-span-4">
                          <div className="font-bold text-[#334155] flex items-center gap-2 mb-1.5 text-base">
                            {col.name}
                            {col.mode === 'singleton' && (
                              <span className="bg-[#6B8E7B]/10 text-[#6B8E7B] px-2 py-0.5 rounded-full text-[9px] uppercase font-black tracking-widest border border-[#6B8E7B]/20">Singleton</span>
                            )}
                          </div>
                          {col.description && <p className="text-xs text-[#64748B] font-medium line-clamp-1">{col.description}</p>}
                        </div>

                        <div className="md:col-span-3">
                          <div className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mb-1.5">Slug DB</div>
                          <code className="text-xs font-semibold text-[#475569] bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">{col.slug}</code>
                        </div>

                        <div className="md:col-span-2">
                          <div className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mb-1.5">UI Tipe</div>
                          <span className="text-xs font-semibold text-[#64748B] bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">{col.presentationType}</span>
                        </div>

                        <div className="md:col-span-3 flex items-center justify-end gap-2 transition-all duration-300">
                          <Button variant="outline" size="sm" className="bg-white border-slate-200 text-[#475569] hover:border-[#6B8E7B]/50 hover:text-[#6B8E7B] rounded-lg">
                            <Link href={`/admin/collections/${col.id}/edit`} className="flex items-center" title="Edit Komponen">
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          {!LOCKED_FIELDS_SLUGS.includes(col.slug) && (
                            <Button variant="outline" size="sm" className="bg-white border-slate-200 text-[#475569] hover:border-[#6B8E7B]/50 hover:text-[#6B8E7B] rounded-lg">
                              <Link href={`/admin/collections/${col.id}/fields`} className="flex items-center">
                                <Settings2 className="mr-1.5 h-4 w-4" />
                                Fields
                              </Link>
                            </Button>
                          )}
                          <Button size="sm" className="bg-[#6B8E7B] text-white hover:bg-[#557162] shadow-sm rounded-lg">
                            <Link href={`/admin/collections/${col.id}/entries`} className="flex items-center">
                              <Database className="mr-1.5 h-4 w-4" />
                              Isi Data
                            </Link>
                          </Button>
                          {!LOCKED_DELETE_SLUGS.includes(col.slug) && (
                            <form action={deleteCollection}>
                              <input type="hidden" name="colId" value={col.id} />
                              <Button
                                variant="outline"
                                size="sm"
                                type="submit"
                                className="bg-white text-rose-500 border-rose-200 hover:text-white hover:bg-rose-500 hover:border-rose-500 rounded-lg transition-colors"
                                title="Hapus Komponen"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </form>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
