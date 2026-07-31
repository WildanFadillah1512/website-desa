import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { contentCollections, contentFields } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { CollectionForm } from "./collection-form";
import { revalidateTag } from "next/cache";
import { invalidateCmsCache } from "@/lib/cms";

export default async function NewCollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const initialPage = resolvedParams.page;

  async function createCollection(formData: FormData) {
    "use server";
    
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const mode = formData.get("mode") as string;
    const page = formData.get("page") as string;
    const presentationType = formData.get("presentationType") as string;
    const isSingleton = mode === "singleton";

    if (!name || !slug) return;

    const [inserted] = await db.insert(contentCollections).values({
      name,
      slug,
      description,
      page,
      mode,
      presentationType,
      isSingleton,
    }).returning();

    const PAGE_INDUK_SLUGS: Record<string, string> = {
      beranda: 'sambutan-kepala-desa',
      profil: 'identitas-desa',
      layanan: 'daftar-layanan',
      eduvillage: 'daftar-pts',
      'data-penduduk': 'data-pekerjaan',
      umum: 'kontak-desa',
    };

    const indukSlug = PAGE_INDUK_SLUGS[page];
    let copiedFields = false;

    if (indukSlug) {
      const [induk] = await db.select().from(contentCollections).where(eq(contentCollections.slug, indukSlug));
      if (induk) {
        const indukFields = await db.select().from(contentFields).where(eq(contentFields.collectionId, induk.id));
        if (indukFields.length > 0) {
          await db.insert(contentFields).values(
            indukFields.map((f) => ({
              collectionId: inserted.id,
              name: f.name,
              key: f.key,
              type: f.type,
              unit: f.unit,
              isRequired: f.isRequired,
              isPublic: f.isPublic,
              isDeletable: f.isDeletable,
              isSystem: f.isSystem,
              sortOrder: f.sortOrder,
            }))
          );
          copiedFields = true;
        }
      }
    }

    if (!copiedFields) {
      // Injeksi 4 default fields sebagai bawaan sistem (isSystem=true, isDeletable=false)
      await db.insert(contentFields).values([
        { collectionId: inserted.id, name: 'Judul', key: 'title', type: 'text', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 1 },
        { collectionId: inserted.id, name: 'Deskripsi Singkat', key: 'summary', type: 'textarea', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 2 },
        { collectionId: inserted.id, name: 'Isi Konten Lengkap', key: 'content', type: 'richtext', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 3 },
        { collectionId: inserted.id, name: 'Gambar / Foto Utama', key: 'thumbnail', type: 'image', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 4 },
      ]);
    }

    invalidateCmsCache();
    revalidateTag("cms", "max");
    redirect(`/admin/collections/${inserted.id}/fields`);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="bg-white border-[#6B8E7B]/20 text-[#334155] hover:bg-[#6B8E7B] hover:text-white transition-colors rounded-xl h-10 w-10 shrink-0">
          <Link href="/admin/collections" className="flex items-center justify-center w-full h-full"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#334155]">Komponen Baru</h1>
          <p className="text-[#64748B] font-medium mt-1">Buat komponen data baru untuk halaman website desa.</p>
        </div>
      </div>

      <CollectionForm action={createCollection} initialPage={initialPage} />
      
    </div>
  );
}
