import { db } from "./src/db";
import { contentCollections, contentFields } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function analyze() {
  const collections = await db.select().from(contentCollections);
  for (const c of collections) {
    const fields = await db.select().from(contentFields).where(eq(contentFields.collectionId, c.id));
    console.log(`Collection: ${c.name} (${c.slug}) - ${fields.length} fields`);
    if (fields.length === 0) {
      console.log(`  -> Injecting default fields for ${c.name}...`);
      await db.insert(contentFields).values([
        { collectionId: c.id, name: 'Judul', key: 'title', type: 'text', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 1 },
        { collectionId: c.id, name: 'Deskripsi Singkat', key: 'summary', type: 'textarea', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 2 },
        { collectionId: c.id, name: 'Isi Konten Lengkap', key: 'content', type: 'richtext', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 3 },
        { collectionId: c.id, name: 'Gambar / Foto Utama', key: 'thumbnail', type: 'image', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 4 },
      ]);
    }
  }
}
analyze().catch(console.error).finally(() => process.exit(0));
