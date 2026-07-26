import { db } from "@/db";
import { contentCollections, contentFields } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Settings2, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FieldForm } from "./field-form";
import { invalidateCmsCache } from "@/lib/cms";

const LOCKED_FIELDS_SLUGS = [
  'sambutan-kepala-desa',
  'profil-desa',
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

export default async function FieldsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collectionId = parseInt(id, 10);
  
  if (isNaN(collectionId)) redirect("/admin/collections");

  const [collection] = await db.select().from(contentCollections).where(eq(contentCollections.id, collectionId));
  if (!collection) redirect("/admin/collections");

  const fields = await db.select().from(contentFields).where(eq(contentFields.collectionId, collectionId)).orderBy(contentFields.sortOrder);

  const isSystemCol = LOCKED_FIELDS_SLUGS.includes(collection.slug);

  async function deleteField(formData: FormData) {
    "use server";
    const fieldId = parseInt(formData.get("fieldId") as string, 10);
    if (!fieldId) return;
    await db.delete(contentFields).where(eq(contentFields.id, fieldId));
    invalidateCmsCache();
    revalidatePath(`/admin/collections/${collectionId}/fields`);
    revalidateTag("cms", "max");
  }

  async function addField(formData: FormData) {
    "use server";
    
    const name = formData.get("name") as string;
    const key = formData.get("key") as string;
    const type = formData.get("type") as string;
    const isRequired = formData.get("isRequired") === "on";
    const isPublic = formData.get("isPublic") === "on";
    const unit = formData.get("unit") as string | undefined;

    if (!name || !key || !type) return;

    // Hitung sortOrder terakhir
    const fieldsCount = await db.select().from(contentFields).where(eq(contentFields.collectionId, collectionId));
    const nextOrder = fieldsCount.length + 1;

    await db.insert(contentFields).values({
      collectionId,
      name,
      key,
      type,
      isRequired,
      isPublic,
      unit: unit || null,
      sortOrder: nextOrder
    });
    
    invalidateCmsCache();
    revalidatePath(`/admin/collections/${collectionId}/fields`);
    revalidateTag("cms", "max");
  }

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="bg-white border-[#6B8E7B]/20 text-[#334155] hover:bg-[#6B8E7B] hover:text-white transition-colors rounded-xl h-10 w-10 shrink-0">
            <Link href="/admin/collections" className="flex items-center justify-center w-full h-full"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black tracking-tight text-[#334155]">{collection.name}</h1>
              <Badge variant="outline" className="bg-[#6B8E7B]/10 text-[#6B8E7B] border-[#6B8E7B]/20 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest shadow-sm">
                {collection.slug}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6 items-start">
        
        {/* ── List Fields ──────────────────────────────────────── */}
        <div className="md:col-span-8 space-y-4">
          {fields.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#6B8E7B]/30 bg-white p-12 text-center shadow-sm">
              <Settings2 className="h-10 w-10 text-[#6B8E7B]/40 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#334155] mb-1">Belum ada field</h3>
              <p className="text-sm text-[#64748B] max-w-sm mx-auto font-medium">Tambahkan field baru untuk menentukan struktur data yang bisa diisi oleh pengguna.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field) => (
                <Card key={field.id} className="overflow-hidden border border-transparent shadow-none hover:shadow-sm hover:border-[#6B8E7B]/20 transition-all duration-300 group rounded-2xl bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-5 gap-4 hover:bg-[#FAF9F6] transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-[#334155] text-base">{field.name}</span>
                        {field.isRequired && (
                          <span className="text-[9px] font-black uppercase tracking-widest bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full border border-rose-200 shadow-sm">Wajib</span>
                        )}
                        {field.isSystem && (
                          <span className="text-[9px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 shadow-sm">Sistem</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-bold text-[#94A3B8]">
                        <span className="font-mono text-[#475569] bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-sm">
                          {field.key}
                        </span>
                        <span className="flex items-center gap-1.5 before:content-[''] before:block before:w-1 before:h-1 before:rounded-full before:bg-[#cbd5e1] uppercase tracking-wider">
                          Tipe: <strong className="text-[#6B8E7B]">{field.type}</strong>
                        </span>
                        {field.unit && (
                          <span className="flex items-center gap-1.5 before:content-[''] before:block before:w-1 before:h-1 before:rounded-full before:bg-[#cbd5e1] uppercase tracking-wider">
                            Unit: <strong className="text-[#64748B]">{field.unit}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {!isSystemCol && field.isDeletable && (
                      <form action={deleteField} className="opacity-100 transition-opacity">
                        <input type="hidden" name="fieldId" value={field.id} />
                        <Button
                          variant="ghost"
                          size="sm"
                          type="submit"
                          className="h-9 w-9 p-0 text-rose-400 hover:text-white hover:bg-rose-500 rounded-xl transition-colors"
                          title="Hapus Field"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* ── Form Tambah Field ────────────────────────────────── */}
        <div className="md:col-span-4">
          {!isSystemCol ? (
            <FieldForm action={addField} />
          ) : (
             <Card className="sticky top-24 border-[#6B8E7B]/10 shadow-sm bg-[#FAF9F6] rounded-2xl">
              <CardHeader className="py-5">
                <CardTitle className="text-lg flex items-center gap-2 font-black text-[#64748B]">
                  <Settings2 className="h-5 w-5" />
                  Komponen Sistem
                </CardTitle>
                <CardDescription className="font-medium">
                  Struktur data pada komponen sistem tidak dapat ditambah atau dihapus demi menjaga kestabilan sistem.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
