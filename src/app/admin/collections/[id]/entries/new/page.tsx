import { db } from "@/db";
import { contentCollections, contentEntries, contentFields } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { revalidatePath, revalidateTag } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { invalidateCmsCache } from "@/lib/cms";

export default async function NewEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collectionId = parseInt(id, 10);
  if (isNaN(collectionId)) notFound();

  const [collection] = await db.select().from(contentCollections).where(eq(contentCollections.id, collectionId));
  if (!collection) notFound();

  const fields = await db.select().from(contentFields).where(eq(contentFields.collectionId, collectionId)).orderBy(contentFields.sortOrder);

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center max-w-2xl mx-auto mt-12 bg-white rounded-2xl border border-dashed border-slate-300">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
          <PlusCircle className="h-8 w-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-[#0f172a]">Skema Belum Dibuat</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Anda tidak dapat menambah data sebelum membuat struktur form (fields) untuk koleksi <strong className="text-slate-700">{collection.name}</strong>. Silakan buat fields terlebih dahulu.
        </p>
        <Button  size="lg" className="shadow-sm">
          <Link href={`/admin/collections/${collectionId}/fields`}>Konfigurasi Skema Data (Fields)</Link>
        </Button>
      </div>
    );
  }

  async function saveEntry(formData: FormData) {
    "use server";
    
    // Extract dynamic fields based on keys
    const data: Record<string, any> = {};
    for (const field of fields) {
      data[field.key] = formData.get(field.key);
    }
    const status = (formData.get("status") as string) || "published";

    await db.insert(contentEntries).values({
      collectionId,
      data,
      status,
    });

    invalidateCmsCache();
    revalidatePath(`/admin/collections/${collectionId}/entries`);
    revalidatePath("/"); // refresh homepage
    revalidateTag("cms", "max");
    redirect(`/admin/collections/${collectionId}/entries`);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon"  className="bg-white">
          <Link href={`/admin/collections/${collectionId}/entries`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a]">Tambah Data</h1>
          <p className="text-slate-500 mt-1">Isi formulir untuk menambahkan data baru ke koleksi {collection.name}.</p>
        </div>
      </div>

      <Card className="animate-fade-in-up border-slate-200">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 rounded-t-2xl">
          <CardTitle className="text-lg flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-[#166534]" />
            Formulir Data
          </CardTitle>
          <CardDescription>Kolom yang bertanda bintang (*) wajib diisi.</CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <form action={saveEntry}>
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Render dinamis berdasarkan Fields */}
              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label htmlFor={field.key} className="text-sm font-bold text-[#0f172a] flex items-center gap-1.5">
                    {field.name}
                    {field.isRequired && <span className="text-red-500 text-base leading-none" title="Wajib diisi">*</span>}
                    {field.unit && <span className="font-normal text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">({field.unit})</span>}
                  </label>
                  
                  {field.type === 'textarea' || field.type === 'richtext' ? (
                    <textarea
                      id={field.key}
                      name={field.key}
                      required={field.isRequired}
                      className="flex min-h-[140px] w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]/20 focus-visible:border-[#166534] transition-all"
                      placeholder={`Masukkan ${field.name.toLowerCase()}...`}
                    />
                  ) : field.type === 'image' ? (
                    <ImageUpload 
                      name={field.key}
                    />
                  ) : (
                    <Input 
                      id={field.key} 
                      name={field.key} 
                      required={field.isRequired}
                      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'}
                      placeholder={`Masukkan ${field.name.toLowerCase()}...`}
                      className="h-11"
                    />
                  )}
                </div>
              ))}
              
              <div className="pt-6 border-t border-slate-100 space-y-2">
                <label htmlFor="status" className="text-sm font-bold text-[#0f172a]">
                  Status Publikasi
                </label>
                <select name="status" id="status" className="flex h-11 w-full sm:w-1/2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]/20 focus-visible:border-[#166534] transition-all font-medium">
                  <option value="published">Dipublikasikan (Tampil ke publik)</option>
                  <option value="draft">Draf (Disembunyikan)</option>
                </select>
              </div>
              
            </div>
            
            {/* Form Actions */}
            <div className="bg-slate-50 p-5 md:px-8 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl">
              <Button variant="ghost"  className="text-slate-600 hover:bg-slate-200">
                <Link href={`/admin/collections/${collectionId}/entries`}>Batalkan</Link>
              </Button>
              <Button type="submit" size="lg" className="shadow-sm">
                <Save className="mr-2 h-4 w-4" />
                Simpan Data Baru
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
