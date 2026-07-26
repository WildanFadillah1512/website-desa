import { db } from "../src/db";
import { contentCollections, contentFields } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function run() {
  // 1. Add url field to layanan-beranda
  const [layananBeranda] = await db.select().from(contentCollections).where(eq(contentCollections.slug, "layanan-beranda"));
  if (layananBeranda) {
    const existingUrl = await db.select().from(contentFields).where(eq(contentFields.collectionId, layananBeranda.id));
    if (!existingUrl.some(f => f.key === "url")) {
      await db.insert(contentFields).values({
        collectionId: layananBeranda.id,
        name: "URL / Tautan Layanan",
        key: "url",
        type: "text",
        isRequired: false,
        isPublic: true,
        isDeletable: false,
        isSystem: true,
        sortOrder: 4,
      });
      console.log("Added URL field to layanan-beranda");
    }
  }

  // 2. Add url_peta to kontak-desa
  const [kontakDesa] = await db.select().from(contentCollections).where(eq(contentCollections.slug, "kontak-desa"));
  if (kontakDesa) {
    const existingPeta = await db.select().from(contentFields).where(eq(contentFields.collectionId, kontakDesa.id));
    if (!existingPeta.some(f => f.key === "url_peta")) {
      await db.insert(contentFields).values({
        collectionId: kontakDesa.id,
        name: "Embed Peta / Google Maps",
        key: "url_peta",
        type: "textarea",
        isRequired: false,
        isPublic: true,
        isDeletable: false,
        isSystem: true,
        sortOrder: 10,
      });
      console.log("Added url_peta field to kontak-desa");
    }
  }
}

run().then(() => {
  console.log("Done");
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
