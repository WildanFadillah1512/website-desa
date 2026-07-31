import "dotenv/config";
import { db } from "../src/db";
import { contentCollections, contentFields, contentEntries } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function migrate() {
  console.log("Memulai migrasi Visi & Misi...");

  // 1. Cek apakah visi-misi lama ada
  const [oldVisiMisi] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'visi-misi'));
  
  let oldVisi = "Terwujudnya Desa yang Maju, Mandiri, dan Sejahtera";
  let oldMisiHtml = "<ul><li>Meningkatkan kualitas pelayanan publik dan tata kelola pemerintahan desa.</li><li>Membangun infrastruktur desa yang memadai dan berwawasan lingkungan.</li><li>Meningkatkan perekonomian masyarakat desa.</li></ul>";

  if (oldVisiMisi) {
    const [oldEntry] = await db.select().from(contentEntries).where(eq(contentEntries.collectionId, oldVisiMisi.id));
    if (oldEntry && oldEntry.data) {
      const data = oldEntry.data as any;
      if (data.visi) oldVisi = data.visi;
      if (data.misi) oldMisiHtml = data.misi;
    }
    // Hapus visi-misi lama (karena cascade, field dan entry juga terhapus kalau di-setup begitu, tapi mari kita hapus manual untuk aman)
    await db.delete(contentEntries).where(eq(contentEntries.collectionId, oldVisiMisi.id));
    await db.delete(contentFields).where(eq(contentFields.collectionId, oldVisiMisi.id));
    await db.delete(contentCollections).where(eq(contentCollections.id, oldVisiMisi.id));
    console.log("Menghapus komponen visi-misi lama.");
  }

  // 2. Buat Visi Desa (Singleton)
  let [visiDesa] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'visi-desa'));
  if (!visiDesa) {
    const [newVisi] = await db.insert(contentCollections).values({
      name: 'Visi Desa',
      slug: 'visi-desa',
      description: 'Visi utama desa',
      mode: 'singleton',
      presentationType: 'key_value',
      page: 'profil',
    }).returning();
    visiDesa = newVisi;

    await db.insert(contentFields).values([
      { collectionId: visiDesa.id, name: 'Visi', key: 'visi', type: 'textarea', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 1 },
    ]);

    await db.insert(contentEntries).values({
      collectionId: visiDesa.id,
      data: { visi: oldVisi }
    });
    console.log("Membuat komponen Visi Desa.");
  }

  // 3. Buat Misi Desa (List)
  let [misiDesa] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'misi-desa'));
  if (!misiDesa) {
    const [newMisi] = await db.insert(contentCollections).values({
      name: 'Misi Desa',
      slug: 'misi-desa',
      description: 'Daftar misi utama desa',
      mode: 'dataset',
      presentationType: 'table',
      page: 'profil',
    }).returning();
    misiDesa = newMisi;

    await db.insert(contentFields).values([
      { collectionId: misiDesa.id, name: 'Poin Misi', key: 'poin_misi', type: 'textarea', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 1 },
    ]);

    // Ekstrak list dari oldMisiHtml (sekadar heuristik)
    const regex = /<li>(.*?)<\/li>/g;
    let match;
    const poinMisiList = [];
    while ((match = regex.exec(oldMisiHtml)) !== null) {
      // Hapus tag HTML di dalamnya jika ada
      poinMisiList.push(match[1].replace(/<[^>]*>?/gm, ""));
    }

    if (poinMisiList.length === 0) {
      // Fallback
      poinMisiList.push("Meningkatkan kualitas pelayanan publik.");
      poinMisiList.push("Membangun infrastruktur desa yang memadai.");
      poinMisiList.push("Meningkatkan perekonomian masyarakat desa.");
    }

    for (const poin of poinMisiList) {
      await db.insert(contentEntries).values({
        collectionId: misiDesa.id,
        data: { poin_misi: poin }
      });
    }
    console.log(`Membuat komponen Misi Desa dengan ${poinMisiList.length} poin.`);
  }

  console.log("Selesai migrasi Visi & Misi.");
  process.exit(0);
}

migrate().catch(console.error);
