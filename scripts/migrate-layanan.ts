import "dotenv/config";
import { db } from "../src/db";
import { contentCollections, contentEntries, contentFields } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function run() {
  console.log("Migrating layanan collections...");

  // 1. Get layanan-desa collection
  let [layananDesa] = await db.select().from(contentCollections).where(eq(contentCollections.slug, "layanan-desa"));
  
  if (!layananDesa) {
    [layananDesa] = await db.insert(contentCollections).values({
      name: 'Layanan Desa Online',
      slug: 'layanan-desa',
      description: 'Daftar link formulir pelayanan surat desa',
      isSingleton: false,
      page: 'layanan',
      mode: 'list',
      presentationType: 'cards'
    }).returning();
    
    await db.insert(contentFields).values([
      { collectionId: layananDesa.id, name: 'Nama Layanan', key: 'nama', type: 'text', isRequired: true, sortOrder: 0, isPublic: true },
      { collectionId: layananDesa.id, name: 'Tautan (URL)', key: 'link', type: 'url', isRequired: true, sortOrder: 1, isPublic: true },
    ]);
  } else {
      // make sure it has 'link' field of type 'url'
      const fields = await db.select().from(contentFields).where(eq(contentFields.collectionId, layananDesa.id));
      const hasLink = fields.find(f => f.key === 'link');
      if (hasLink && hasLink.type !== 'url') {
          await db.update(contentFields).set({ type: 'url' }).where(eq(contentFields.id, hasLink.id));
      }
      if (!hasLink) {
         await db.insert(contentFields).values([
            { collectionId: layananDesa.id, name: 'Tautan (URL)', key: 'link', type: 'url', isRequired: true, sortOrder: 1, isPublic: true },
         ]);
      }
  }

  // 2. Fetch data from layanan-beranda (if exists)
  const [layananBeranda] = await db.select().from(contentCollections).where(eq(contentCollections.slug, "layanan-beranda"));
  
  if (layananBeranda) {
    const entries = await db.select().from(contentEntries).where(eq(contentEntries.collectionId, layananBeranda.id));
    
    // Clear existing layanan-desa entries to avoid duplicates
    await db.delete(contentEntries).where(eq(contentEntries.collectionId, layananDesa.id));

    // Insert migrated entries to layanan-desa
    for (const entry of entries) {
      const oldData = entry.data as Record<string, any>;
      const nama = oldData.nama_layanan || oldData.nama || "Layanan";
      
      await db.insert(contentEntries).values({
        collectionId: layananDesa.id,
        data: {
          nama: nama,
          link: "https://wildan-fadillah.netlify.app/",
        },
        status: entry.status,
      });
    }

    // Delete layanan-beranda collection completely
    await db.delete(contentCollections).where(eq(contentCollections.id, layananBeranda.id));
    console.log("Migrated data and deleted layanan-beranda collection.");
  } else {
     // Ensure there's some data in layanan-desa if beranda didn't exist
     const entries = await db.select().from(contentEntries).where(eq(contentEntries.collectionId, layananDesa.id));
     if (entries.length === 0) {
        const defaultLayanan = ['Pengantar SKCK', 'Surat Keterangan Domisili', 'Surat Keterangan Tidak Mampu', 'Surat Pengantar KTP / KK'];
        for (const nama of defaultLayanan) {
            await db.insert(contentEntries).values({
                collectionId: layananDesa.id,
                data: { nama, link: "https://wildan-fadillah.netlify.app/" },
                status: 'published'
            });
        }
     } else {
        // Update existing to new url
        for (const entry of entries) {
            const data = entry.data as any;
            data.link = "https://wildan-fadillah.netlify.app/";
            await db.update(contentEntries).set({ data }).where(eq(contentEntries.id, entry.id));
        }
     }
  }

  console.log("Migration complete!");
}

run().catch(console.error).finally(() => process.exit(0));
