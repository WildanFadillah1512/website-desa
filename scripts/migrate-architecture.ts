import { db } from "../src/db";
import { contentCollections, contentFields } from "../src/db/schema";
import { eq, inArray } from "drizzle-orm";

async function run() {
  console.log("Memulai Migrasi Arsitektur...");

  // 1. Pindah Kontak Desa ke Profil
  await db.update(contentCollections).set({ page: 'profil' }).where(eq(contentCollections.slug, 'kontak-desa'));
  console.log("- Kontak Desa dipindah ke Profil");
  
  // 2. Pindah Kampus ke EduVillage
  await db.update(contentCollections).set({ page: 'eduvillage' }).where(eq(contentCollections.slug, 'kampus'));
  console.log("- Kampus dipindah ke EduVillage");

  // 3. Hapus layanan lama
  await db.delete(contentCollections).where(inArray(contentCollections.slug, ['layanan-desa', 'daftar-layanan']));
  console.log("- Koleksi Layanan lama dihapus");

  // 4. Buat layanan baru (singleton)
  const layanans = [
    { name: 'Surat Keterangan Usaha (SKU)', slug: 'surat-keterangan-usaha' },
    { name: 'Surat Pengantar Nikah', slug: 'surat-pengantar-nikah' },
    { name: 'Surat Keterangan Tidak Mampu (SKTM)', slug: 'surat-keterangan-tidak-mampu' },
  ];

  for (const l of layanans) {
    const existing = await db.select().from(contentCollections).where(eq(contentCollections.slug, l.slug));
    if (existing.length === 0) {
      const [inserted] = await db.insert(contentCollections).values({
        name: l.name,
        slug: l.slug,
        description: `Pengaturan komponen ${l.name}`,
        page: 'layanan',
        mode: 'singleton',
        presentationType: 'key_value', // Use key_value for rendering simple singletons
        isSingleton: true,
      }).returning();
      
      // Kasih field default untuk form surat
      await db.insert(contentFields).values([
        { collectionId: inserted.id, name: 'Deskripsi Layanan', key: 'description', type: 'textarea', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 1 },
        { collectionId: inserted.id, name: 'Tautan Google Form', key: 'form_url', type: 'url', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 2 },
      ]);
      console.log(`- Dibuat komponen baru: ${l.name}`);
    }
  }

  console.log("Migrasi Selesai!");
}

run().catch(console.error).finally(() => process.exit(0));
