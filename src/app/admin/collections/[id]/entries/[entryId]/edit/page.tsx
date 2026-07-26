import { db } from "@/db";
import { contentCollections, contentEntries, contentFields } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { revalidatePath, revalidateTag } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { invalidateCmsCache } from "@/lib/cms";
import { resolveImageField } from "@/lib/blob-upload";

export default async function EditEntryPage({ params }: { params: Promise<{ id: string; entryId: string }> }) {
  const { id, entryId } = await params;
  const collectionId = parseInt(id, 10);
  const entryIdNum = parseInt(entryId, 10);
  if (isNaN(collectionId) || isNaN(entryIdNum)) notFound();

  const [collection] = await db.select().from(contentCollections).where(eq(contentCollections.id, collectionId));
  if (!collection) notFound();

  const [entry] = await db.select().from(contentEntries).where(eq(contentEntries.id, entryIdNum));
  if (!entry) notFound();

  const fields = await db.select().from(contentFields).where(eq(contentFields.collectionId, collectionId)).orderBy(contentFields.sortOrder);
  const data = entry.data as Record<string, string>;

  async function updateEntry(formData: FormData) {
    "use server";
    const newFieldData: Record<string, string> = {};
    for (const field of fields) {
      newFieldData[field.key] =
        field.type === "image"
          ? await resolveImageField(formData, field.key)
          : ((formData.get(field.key) as string) ?? "");
    }
    const status = (formData.get("status") as string) || "published";

    // Preserve orphaned data (fields that were deleted after entries were created)
    const mergedData = { ...data, ...newFieldData };

    await db.update(contentEntries).set({ data: mergedData, status, updatedAt: new Date() }).where(eq(contentEntries.id, entryIdNum));
    invalidateCmsCache();
    revalidatePath(`/admin/collections/${collectionId}/entries`);
    revalidateTag("cms", "max");
    redirect(`/admin/collections/${collectionId}/entries`);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon"  className="bg-white">
          <Link href={`/admin/collections/${collectionId}/entries`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a]">Edit Data</h1>
          <p className="text-slate-500 mt-1">Perbarui data pada koleksi {collection.name}.</p>
        </div>
      </div>

      <Card className="animate-fade-in-up border-slate-200">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-lg">Formulir Edit</CardTitle>
          <CardDescription>Kolom bertanda (*) wajib diisi.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form action={updateEntry} encType="multipart/form-data">
            <div className="p-6 space-y-6">
              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label htmlFor={field.key} className="text-sm font-bold text-[#0f172a] flex items-center gap-1.5">
                    {field.name}
                    {field.isRequired && <span className="text-red-500 text-base leading-none">*</span>}
                    {field.unit && <span className="font-normal text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">({field.unit})</span>}
                  </label>
                  {field.type === 'image' ? (
                    <ImageUpload name={field.key} defaultValue={data[field.key]} />
                  ) : (field.type === 'textarea' || field.type === 'richtext') ? (
                    <textarea
                      id={field.key}
                      name={field.key}
                      required={field.isRequired}
                      defaultValue={data[field.key] ?? ""}
                      className="flex min-h-[140px] w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]/20 focus-visible:border-[#166534] transition-all"
                    />
                  ) : (
                    <Input
                      id={field.key}
                      name={field.key}
                      required={field.isRequired}
                      defaultValue={data[field.key] ?? ""}
                      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'}
                      className="h-11"
                    />
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <label htmlFor="status" className="text-sm font-bold text-[#0f172a]">Status Publikasi</label>
                <select name="status" id="status" defaultValue={entry.status} className="flex h-11 w-full sm:w-1/2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534]/20 focus-visible:border-[#166534] transition-all">
                  <option value="published">Dipublikasikan</option>
                  <option value="draft">Draf</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 p-5 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
              <Button variant="ghost" >
                <Link href={`/admin/collections/${collectionId}/entries`}>Batalkan</Link>
              </Button>
              <Button type="submit" size="lg" className="bg-[#166534] hover:bg-[#14532D]">
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
