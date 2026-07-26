import { db } from "@/db";
import { contentCollections, contentEntries, contentFields } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, PlusCircle, Plus, Edit, Trash2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { revalidatePath, revalidateTag } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { invalidateCmsCache } from "@/lib/cms";
import { resolveImageField } from "@/lib/blob-upload";

export const dynamic = 'force-dynamic';

export default async function EntriesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collectionId = parseInt(id, 10);
  if (isNaN(collectionId)) notFound();

  const [collection] = await db.select().from(contentCollections).where(eq(contentCollections.id, collectionId));
  if (!collection) notFound();

  const fields = await db.select().from(contentFields).where(eq(contentFields.collectionId, collectionId)).orderBy(contentFields.sortOrder);
  const entries = await db.select().from(contentEntries).where(eq(contentEntries.collectionId, collectionId)).orderBy(contentEntries.createdAt);

  const isSingleton = collection.mode === 'singleton';

  // ─── Server Actions ───────────────────────────────────────────────────────
  async function saveEntry(formData: FormData) {
    "use server";
    const status = (formData.get("status") as string) || "published";
    const existingId = formData.get("existingId") as string;

    // Build new data ONLY for currently-active fields
    const newFieldData: Record<string, string> = {};
    for (const field of fields) {
      newFieldData[field.key] =
        field.type === "image"
          ? await resolveImageField(formData, field.key)
          : ((formData.get(field.key) as string) ?? "");
    }

    if (existingId) {
      // ✅ Fetch existing entry to preserve orphaned field data (e.g. field C was deleted)
      const [existing] = await db.select().from(contentEntries).where(eq(contentEntries.id, parseInt(existingId)));
      const orphanedData = existing ? (existing.data as Record<string, string>) : {};

      // Merge: keep old keys (orphaned), override with new form values
      const mergedData = { ...orphanedData, ...newFieldData };

      await db.update(contentEntries).set({ data: mergedData, status, updatedAt: new Date() }).where(eq(contentEntries.id, parseInt(existingId)));
    } else {
      await db.insert(contentEntries).values({ collectionId, data: newFieldData, status });
    }

    invalidateCmsCache();
    revalidatePath(`/admin/collections/${collectionId}/entries`);
    revalidateTag("cms", "max");
    redirect(`/admin/collections/${collectionId}/entries`);
  }

  async function deleteEntry(formData: FormData) {
    "use server";
    const entryId = parseInt(formData.get("entryId") as string, 10);
    if (!entryId) return;
    await db.delete(contentEntries).where(eq(contentEntries.id, entryId));
    invalidateCmsCache();
    revalidatePath(`/admin/collections/${collectionId}/entries`);
    revalidateTag("cms", "max");
  }

  // ─── Shared: Form Renderer ────────────────────────────────────────────────
  const existingEntry = isSingleton ? entries[0] : null;
  const existingData = existingEntry ? (existingEntry.data as Record<string, string>) : {};

  const EntryForm = ({ entry }: { entry?: typeof entries[0] }) => {
    const data = entry ? (entry.data as Record<string, string>) : {};
    return (
      <form action={saveEntry} encType="multipart/form-data">
        {entry && <input type="hidden" name="existingId" value={entry.id} />}
        <div className="p-6 space-y-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label htmlFor={`${entry?.id ?? 'new'}-${field.key}`} className="text-sm font-bold text-[#0f172a] flex items-center gap-1.5">
                {field.name}
                {field.isRequired && <span className="text-red-500 text-base leading-none">*</span>}
                {field.unit && <span className="font-normal text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">({field.unit})</span>}
              </label>
              {field.type === 'image' ? (
                <ImageUpload name={field.key} defaultValue={data[field.key]} />
              ) : (field.type === 'textarea' || field.type === 'richtext') ? (
                <textarea
                  id={`${entry?.id ?? 'new'}-${field.key}`}
                  name={field.key}
                  required={field.isRequired}
                  defaultValue={data[field.key] ?? ""}
                  className="flex min-h-[140px] w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]/20 focus-visible:border-[#166534] transition-all"
                  placeholder={`Masukkan ${field.name.toLowerCase()}...`}
                />
              ) : (
                <Input
                  id={`${entry?.id ?? 'new'}-${field.key}`}
                  name={field.key}
                  required={field.isRequired}
                  defaultValue={data[field.key] ?? ""}
                  type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'}
                  placeholder={`Masukkan ${field.name.toLowerCase()}...`}
                  className="h-11"
                />
              )}
            </div>
          ))}
        </div>
        <div className="bg-slate-50 p-5 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
          <Button type="submit" size="lg" className="bg-[#166534] hover:bg-[#14532D]">
            <Save className="mr-2 h-4 w-4" />
            {entry ? 'Perbarui Data' : 'Simpan Data'}
          </Button>
        </div>
      </form>
    );
  };

  // ─── MODE: SINGLETON ──────────────────────────────────────────────────────
  if (isSingleton) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon"  className="bg-white">
            <Link href="/admin/collections"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a]">{collection.name}</h1>
            <p className="text-slate-500 mt-1">{existingEntry ? 'Perbarui data komponen ini.' : 'Isi data untuk komponen ini.'}</p>
          </div>
        </div>

        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-2xl border border-dashed border-[#6B8E7B]/30 shadow-sm">
            <PlusCircle className="h-12 w-12 text-[#6B8E7B]/40 mb-4" />
            <h2 className="text-xl font-bold text-[#334155] mb-2">Skema Belum Dibuat</h2>
            <p className="text-[#64748B] mb-6">Buat field terlebih dahulu sebelum mengisi data.</p>
            <Button className="bg-[#6B8E7B] hover:bg-[#557162] shadow-sm rounded-lg"><Link href={`/admin/collections/${collectionId}/fields`}>Konfigurasi Fields</Link></Button>
          </div>
        ) : (
          <Card className="animate-fade-in-up border border-[#6B8E7B]/10 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="border-b border-[#6B8E7B]/10 bg-gradient-to-r from-[#FAF9F6] to-white py-5 px-6">
              <CardTitle className="flex items-center gap-3 text-lg font-black text-[#334155]">
                <div className="h-10 w-10 rounded-xl bg-white border border-[#6B8E7B]/20 shadow-sm flex items-center justify-center">
                  {existingEntry ? <Edit className="h-5 w-5 text-[#6B8E7B]" /> : <PlusCircle className="h-5 w-5 text-[#6B8E7B]" />}
                </div>
                {existingEntry ? 'Edit & Perbarui Data' : 'Isi Data Baru'}
              </CardTitle>
              <CardDescription className="text-[#64748B] font-medium ml-13">Kolom bertanda (*) wajib diisi.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <EntryForm entry={existingEntry ?? undefined} />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ─── MODE: LIST / DATASET ──────────────────────────────────────────────────
  const titleField = fields.find(f => f.key === 'title' || f.key === 'nama' || f.key === 'pekerjaan' || f.key === 'komoditas') || fields[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="bg-white border-[#6B8E7B]/20 text-[#334155] hover:bg-[#6B8E7B] hover:text-white transition-colors rounded-xl h-10 w-10">
            <Link href="/admin/collections" className="flex items-center justify-center w-full h-full"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#334155]">{collection.name}</h1>
            <p className="text-[#64748B] font-medium mt-1">{collection.description || 'Kelola isi data untuk komponen ini.'}</p>
          </div>
        </div>
        <Button className="bg-[#6B8E7B] hover:bg-[#557162] text-white shadow-sm rounded-xl px-5 h-10">
          <Link href={`/admin/collections/${collectionId}/entries/new`} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Data
          </Link>
        </Button>
      </div>

      <Card className="animate-fade-in-up border border-[#6B8E7B]/10 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="border-b border-[#6B8E7B]/10 bg-gradient-to-r from-[#FAF9F6] to-white py-5 px-6">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-3 text-lg font-black text-[#334155]">
              <div className="h-10 w-10 rounded-xl bg-white border border-[#6B8E7B]/20 shadow-sm flex items-center justify-center">
                <Database className="h-5 w-5 text-[#6B8E7B]" />
              </div>
              Daftar Data ({entries.length})
            </CardTitle>
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-[#6B8E7B]/10 text-[#6B8E7B] border-[#6B8E7B]/20 px-3 py-1 rounded-full shadow-sm">{collection.mode}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <Database className="h-12 w-12 text-[#6B8E7B]/30 mb-4" />
              <h3 className="text-lg font-bold text-[#334155] mb-1">Belum Ada Data</h3>
              <p className="text-[#64748B] mb-6 font-medium">Mulai tambahkan data pertama Anda sekarang.</p>
              <Button className="bg-[#6B8E7B] hover:bg-[#557162] rounded-lg shadow-sm">
                <Link href={`/admin/collections/${collectionId}/entries/new`}>Tambah Data Pertama</Link>
              </Button>
            </div>
          ) : collection.mode === 'dataset' ? (
            /* ── DATASET: Table View ─── */
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#FAF9F6] border-b border-[#6B8E7B]/10 text-[#64748B] font-bold">
                  <tr>
                    {fields.slice(0, 5).map(f => (
                      <th key={f.id} className="px-6 py-4 whitespace-nowrap uppercase tracking-wider text-[10px]">{f.name}</th>
                    ))}
                    <th className="px-6 py-4 whitespace-nowrap text-right uppercase tracking-wider text-[10px]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6B8E7B]/5">
                  {entries.map(entry => {
                    const data = entry.data as Record<string, string>;
                    return (
                      <tr key={entry.id} className="hover:bg-[#FAF9F6]/50 transition-colors group">
                        {fields.slice(0, 5).map(f => (
                          <td key={f.id} className="px-6 py-4 text-[#475569] font-medium">
                            {String(data[f.key] ?? '-')}
                            {f.unit ? <span className="text-[#94A3B8] text-xs ml-1 font-normal">{f.unit}</span> : ''}
                          </td>
                        ))}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 transition-opacity">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-white border-[#6B8E7B]/20 text-[#6B8E7B] hover:bg-[#6B8E7B] hover:text-white rounded-lg">
                              <Link href={`/admin/collections/${collectionId}/entries/${entry.id}/edit`} className="flex items-center justify-center w-full h-full">
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <form action={deleteEntry}>
                              <input type="hidden" name="entryId" value={entry.id} />
                              <Button variant="outline" size="sm" type="submit" className="h-8 w-8 p-0 bg-white text-rose-500 border-rose-200 hover:text-white hover:bg-rose-500 hover:border-rose-500 rounded-lg transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* ── LIST: Card View ─── */
            <div className="divide-y divide-[#6B8E7B]/5 p-2">
              {entries.map((entry) => {
                const data = entry.data as Record<string, string>;
                const title = titleField ? data[titleField.key] : `Entry #${entry.id}`;
                return (
                  <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-5 hover:bg-[#FAF9F6] transition-all duration-300 rounded-xl gap-4 group border border-transparent hover:border-[#6B8E7B]/10">
                    <div className="font-bold text-[#334155] text-base">{String(title || 'Tanpa Judul')}</div>
                    <div className="flex items-center gap-2 transition-opacity">
                      <Button variant="outline" size="sm" className="bg-white border-[#6B8E7B]/20 text-[#475569] hover:border-[#6B8E7B] hover:text-[#6B8E7B] rounded-lg">
                        <Link href={`/admin/collections/${collectionId}/entries/${entry.id}/edit`} className="flex items-center">
                          <Edit className="mr-1.5 h-4 w-4" /> Edit
                        </Link>
                      </Button>
                      <form action={deleteEntry}>
                        <input type="hidden" name="entryId" value={entry.id} />
                        <Button variant="outline" size="sm" type="submit" className="bg-white text-rose-500 border-rose-200 hover:bg-rose-500 hover:text-white hover:border-rose-500 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
