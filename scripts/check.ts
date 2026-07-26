import { db } from "../src/db";
import { contentCollections, contentEntries } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function check() {
  const [col] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'sambutan-kepala-desa'));
  if (!col) { console.log("Koleksi tidak ditemukan!"); return; }
  console.log("Koleksi ID:", col.id);
  
  const entries = await db.select().from(contentEntries).where(eq(contentEntries.collectionId, col.id));
  if (entries.length === 0) { console.log("Tidak ada entry!"); return; }
  
  for (const entry of entries) {
    console.log("--- Entry ID:", entry.id, "---");
    const data = entry.data as Record<string, string>;
    for (const [key, val] of Object.entries(data)) {
      const isImage = typeof val === 'string' && val.startsWith('data:');
      console.log(`  ${key}: ${isImage ? '[BASE64 IMAGE ' + Math.round(val.length/1024) + 'KB]' : val?.slice(0,80)}`);
    }
  }
}
check().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
