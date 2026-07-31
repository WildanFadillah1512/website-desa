import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { contentCollections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import { EditCollectionForm } from "./edit-collection-form";
import { revalidateTag, revalidatePath } from "next/cache";
import { invalidateCmsCache } from "@/lib/cms";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const colId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(colId)) notFound();

  const [collection] = await db
    .select()
    .from(contentCollections)
    .where(eq(contentCollections.id, colId));

  if (!collection) notFound();

  async function updateCollection(formData: FormData) {
    "use server";
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const mode = formData.get("mode") as string;
    const page = formData.get("page") as string;
    const presentationType = formData.get("presentationType") as string;
    const isSingleton = mode === "singleton";

    if (!name) return;

    await db.update(contentCollections).set({
      name,
      description,
      page,
      mode,
      presentationType,
      isSingleton,
      updatedAt: new Date(),
    }).where(eq(contentCollections.id, colId));

    invalidateCmsCache();
    revalidateTag("cms", "max");
    revalidatePath("/admin/collections");
    redirect("/admin/collections");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="bg-white border-[#6B8E7B]/20 text-[#334155] hover:bg-[#6B8E7B] hover:text-white transition-colors rounded-xl h-10 w-10 shrink-0">
          <Link href="/admin/collections" className="flex items-center justify-center w-full h-full"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#334155]">Edit Komponen</h1>
          <p className="text-[#64748B] font-medium mt-1">Ubah metadata dan pengaturan dari komponen.</p>
        </div>
      </div>

      <EditCollectionForm collection={collection} action={updateCollection} />
      
    </div>
  );
}
