import { db } from "../src/db";
import { contentCollections, contentFields, contentEntries } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function run() {
  const [identitas] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'identitas-desa'));
  
  if (identitas) {
    const fields = await db.select().from(contentFields).where(eq(contentFields.collectionId, identitas.id));
    const hasBg = fields.find(f => f.key === 'hero_background');
    
    if (!hasBg) {
      await db.insert(contentFields).values([
        { 
          collectionId: identitas.id, 
          name: 'Gambar Background Hero', 
          key: 'hero_background', 
          type: 'image', 
          isRequired: false, 
          isPublic: true, 
          isDeletable: false, 
          isSystem: true, 
          sortOrder: 15 
        }
      ]);
      console.log("✅ Tambah field hero_background ke identitas-desa");
    } else {
      console.log("Field hero_background sudah ada.");
    }
  } else {
    console.log("Koleksi identitas-desa tidak ditemukan!");
  }
}

run().catch(console.error).finally(() => process.exit(0));
