import { db } from "../src/db";
import { contentCollections, contentFields } from "../src/db/schema";
import { eq, inArray } from "drizzle-orm";

async function run() {
  console.log("Menambahkan struktur baru...");

  // 1. Tambah Kecamatan dan Kabupaten ke identitas-desa
  let [identitas] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'identitas-desa'));
  if (identitas) {
    const identitasFields = await db.select().from(contentFields).where(eq(contentFields.collectionId, identitas.id));
    const toInsert = [];
    if (!identitasFields.find(f => f.key === 'kecamatan')) {
      toInsert.push({ collectionId: identitas.id, name: 'Kecamatan', key: 'kecamatan', type: 'text', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 2 });
    }
    if (!identitasFields.find(f => f.key === 'kabupaten')) {
      toInsert.push({ collectionId: identitas.id, name: 'Kabupaten / Kota', key: 'kabupaten', type: 'text', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 3 });
    }
    if (!identitasFields.find(f => f.key === 'provinsi')) {
      toInsert.push({ collectionId: identitas.id, name: 'Provinsi', key: 'provinsi', type: 'text', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 4 });
    }
    
    // Hapus hero_background dari identitas-desa karena user minta dipindah
    const heroBgField = identitasFields.find(f => f.key === 'hero_background');
    if (heroBgField) {
      await db.delete(contentFields).where(eq(contentFields.id, heroBgField.id));
      console.log("  ✅ Hapus hero_background dari identitas-desa");
    }

    if (toInsert.length > 0) {
      await db.insert(contentFields).values(toInsert);
      console.log("  ✅ Tambah kecamatan, kabupaten, provinsi ke identitas-desa");
    }
  }

  // 2. Buat Pengaturan Tampilan Beranda (untuk Hero Bg dan Logo)
  let [pengaturanBeranda] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'pengaturan-beranda'));
  if (!pengaturanBeranda) {
    const [inserted] = await db.insert(contentCollections).values({
      name: 'Pengaturan Tampilan',
      slug: 'pengaturan-beranda',
      description: 'Logo desa dan gambar background hero',
      page: 'beranda',
      mode: 'singleton',
      presentationType: 'rich_text',
      isSingleton: true
    }).returning();
    pengaturanBeranda = inserted;
    
    await db.insert(contentFields).values([
      { collectionId: pengaturanBeranda.id, name: 'Logo Desa (Upload)', key: 'logo', type: 'image', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 1 },
      { collectionId: pengaturanBeranda.id, name: 'Gambar Background Hero', key: 'hero_background', type: 'image', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 2 },
    ]);
    console.log("  ✅ Buat koleksi pengaturan-beranda (Logo & Background)");
  }

  // 3. Tambahkan Rukun Warga ke informasi-wilayah
  let [infoWilayah] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'informasi-wilayah'));
  if (infoWilayah) {
    const fields = await db.select().from(contentFields).where(eq(contentFields.collectionId, infoWilayah.id));
    if (!fields.find(f => f.key === 'jumlah_rw')) {
      await db.insert(contentFields).values({
        collectionId: infoWilayah.id,
        name: 'Jumlah RW',
        key: 'jumlah_rw',
        type: 'number',
        isRequired: false,
        isPublic: true,
        isDeletable: false,
        isSystem: true,
        sortOrder: 10
      });
      console.log("  ✅ Tambah jumlah_rw ke informasi-wilayah");
    }
  }

  // 4. Tambahkan Sosial Media ke kontak-desa
  let [kontak] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'kontak-desa'));
  if (kontak) {
    const fields = await db.select().from(contentFields).where(eq(contentFields.collectionId, kontak.id));
    const toInsert = [];
    if (!fields.find(f => f.key === 'url_facebook')) toInsert.push({ collectionId: kontak.id, name: 'Link Facebook', key: 'url_facebook', type: 'url', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 10 });
    if (!fields.find(f => f.key === 'url_youtube')) toInsert.push({ collectionId: kontak.id, name: 'Link YouTube', key: 'url_youtube', type: 'url', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 11 });
    if (!fields.find(f => f.key === 'url_whatsapp')) toInsert.push({ collectionId: kontak.id, name: 'Nomor / Link WhatsApp', key: 'url_whatsapp', type: 'url', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 12 });
    if (!fields.find(f => f.key === 'url_tiktok')) toInsert.push({ collectionId: kontak.id, name: 'Link TikTok', key: 'url_tiktok', type: 'url', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 13 });
    if (toInsert.length > 0) {
      await db.insert(contentFields).values(toInsert);
      console.log("  ✅ Tambah sosial media ke kontak-desa");
    }
  }

  console.log("\nSelesai!");
}

run().catch(console.error).finally(() => process.exit(0));
