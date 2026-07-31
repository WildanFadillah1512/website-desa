import "dotenv/config";
import { db } from "../src/db";
import { contentCollections, contentFields, contentEntries } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function restore() {
  console.log("Restoring original fields for visi-misi and potensi-desa...");

  // Restore Visi Misi
  const [visimisi] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'visi-misi'));
  if (visimisi) {
    await db.delete(contentFields).where(eq(contentFields.collectionId, visimisi.id));
    await db.insert(contentFields).values([
      { collectionId: visimisi.id, name: 'Visi', key: 'visi', type: 'text', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 1 },
      { collectionId: visimisi.id, name: 'Misi', key: 'misi', type: 'richtext', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 2 },
    ]);
    console.log("Restored fields for Visi & Misi");
  }

  // Restore Potensi Desa
  const [potensi] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'potensi-desa'));
  if (potensi) {
    await db.delete(contentFields).where(eq(contentFields.collectionId, potensi.id));
    await db.insert(contentFields).values([
      { collectionId: potensi.id, name: 'Komoditas / Ternak', key: 'komoditas', type: 'text', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 1 },
      { collectionId: potensi.id, name: 'Keterangan / Jumlah', key: 'keterangan', type: 'text', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 2 },
    ]);
    console.log("Restored fields for Potensi Desa");
  }

  console.log("Selesai restore data.");
  process.exit(0);
}

restore().catch(console.error);
