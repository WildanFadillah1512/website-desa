import "dotenv/config";
import { db } from "../src/db";
import { contentCollections, contentEntries, contentFields } from "../src/db/schema";
import { inArray } from "drizzle-orm";

async function run() {
  console.log("Menghapus koleksi layanan yang membingungkan...");

  const slugsToDelete = [
    'surat-keterangan-usaha',
    'surat-keterangan-tidak-mampu',
    'surat-pengantar-nikah'
  ];

  const collections = await db.select().from(contentCollections).where(inArray(contentCollections.slug, slugsToDelete));
  
  if (collections.length > 0) {
    const colIds = collections.map(c => c.id);
    
    // Hapus entries
    await db.delete(contentEntries).where(inArray(contentEntries.collectionId, colIds));
    
    // Hapus fields
    await db.delete(contentFields).where(inArray(contentFields.collectionId, colIds));
    
    // Hapus collections
    await db.delete(contentCollections).where(inArray(contentCollections.id, colIds));
    
    console.log(`Berhasil menghapus ${collections.length} koleksi ganda.`);
  } else {
    console.log("Koleksi ganda sudah tidak ada.");
  }

}

run().catch(console.error).finally(() => process.exit(0));
