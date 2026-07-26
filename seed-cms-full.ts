import "dotenv/config";
import { db } from "./src/db";
import { contentCollections, contentFields } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding CMS Collections for all Pages...");

  // 1. Identitas Desa (Profil)
  let [identitas] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'identitas-desa'));
  if (!identitas) {
    [identitas] = await db.insert(contentCollections).values({
      name: 'Identitas Desa', slug: 'identitas-desa', description: 'Data utama tentang Desa Cikahuripan',
      mode: 'singleton', presentationType: 'key_value', page: 'profil', isSingleton: true,
    }).returning();
    await db.insert(contentFields).values([
      { collectionId: identitas.id, name: 'Nama Desa', key: 'nama_desa', type: 'text', isRequired: true, isPublic: true, sortOrder: 1 },
      { collectionId: identitas.id, name: 'Kecamatan', key: 'kecamatan', type: 'text', isRequired: true, isPublic: true, sortOrder: 2 },
      { collectionId: identitas.id, name: 'Kabupaten', key: 'kabupaten', type: 'text', isRequired: true, isPublic: true, sortOrder: 3 },
      { collectionId: identitas.id, name: 'Provinsi', key: 'provinsi', type: 'text', isRequired: true, isPublic: true, sortOrder: 4 },
    ]);
  }

  // 2. Visi Misi (Profil)
  let [visimisi] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'visi-misi'));
  if (!visimisi) {
    [visimisi] = await db.insert(contentCollections).values({
      name: 'Visi & Misi', slug: 'visi-misi', description: 'Visi dan misi utama desa',
      mode: 'singleton', presentationType: 'rich_text', page: 'profil', isSingleton: true,
    }).returning();
    await db.insert(contentFields).values([
      { collectionId: visimisi.id, name: 'Visi', key: 'visi', type: 'text', isRequired: true, isPublic: true, sortOrder: 1 },
      { collectionId: visimisi.id, name: 'Misi', key: 'misi', type: 'richtext', isRequired: true, isPublic: true, sortOrder: 2 },
    ]);
  }

  // 3. Informasi Wilayah (Profil)
  let [wilayah] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'informasi-wilayah'));
  if (!wilayah) {
    [wilayah] = await db.insert(contentCollections).values({
      name: 'Informasi Wilayah', slug: 'informasi-wilayah', description: 'Data luas dan batas wilayah desa',
      mode: 'singleton', presentationType: 'key_value', page: 'profil', isSingleton: true,
    }).returning();
    await db.insert(contentFields).values([
      { collectionId: wilayah.id, name: 'Luas Wilayah', key: 'luas_wilayah', type: 'number', unit: 'Ha', isRequired: true, isPublic: true, sortOrder: 1 },
      { collectionId: wilayah.id, name: 'Jumlah RW', key: 'jumlah_rw', type: 'number', isRequired: true, isPublic: true, sortOrder: 2 },
      { collectionId: wilayah.id, name: 'Jumlah RT', key: 'jumlah_rt', type: 'number', isRequired: true, isPublic: true, sortOrder: 3 },
      { collectionId: wilayah.id, name: 'Batas Utara', key: 'batas_utara', type: 'text', isRequired: true, isPublic: true, sortOrder: 4 },
      { collectionId: wilayah.id, name: 'Batas Selatan', key: 'batas_selatan', type: 'text', isRequired: true, isPublic: true, sortOrder: 5 },
      { collectionId: wilayah.id, name: 'Batas Timur', key: 'batas_timur', type: 'text', isRequired: true, isPublic: true, sortOrder: 6 },
      { collectionId: wilayah.id, name: 'Batas Barat', key: 'batas_barat', type: 'text', isRequired: true, isPublic: true, sortOrder: 7 },
    ]);
  }

  // 4. Kependudukan Berdasarkan Pekerjaan
  let [pekerjaan] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'data-pekerjaan'));
  if (!pekerjaan) {
    [pekerjaan] = await db.insert(contentCollections).values({
      name: 'Berdasarkan Mata Pencaharian', slug: 'data-pekerjaan', description: 'Statistik pekerjaan warga desa',
      mode: 'dataset', presentationType: 'table', page: 'data-penduduk', isSingleton: false,
    }).returning();
    await db.insert(contentFields).values([
      { collectionId: pekerjaan.id, name: 'Pekerjaan', key: 'pekerjaan', type: 'text', isRequired: true, isPublic: true, sortOrder: 1 },
      { collectionId: pekerjaan.id, name: 'Jumlah', key: 'jumlah', type: 'number', unit: 'orang', isRequired: true, isPublic: true, sortOrder: 2 },
    ]);
  }

  // 5. Potensi Desa (Profil)
  let [potensi] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'potensi-desa'));
  if (!potensi) {
    [potensi] = await db.insert(contentCollections).values({
      name: 'Potensi Desa', slug: 'potensi-desa', description: 'Data komoditas unggulan desa',
      mode: 'dataset', presentationType: 'table', page: 'profil', isSingleton: false,
    }).returning();
    await db.insert(contentFields).values([
      { collectionId: potensi.id, name: 'Komoditas / Ternak', key: 'komoditas', type: 'text', isRequired: true, isPublic: true, sortOrder: 1 },
      { collectionId: potensi.id, name: 'Keterangan / Jumlah', key: 'keterangan', type: 'text', isRequired: true, isPublic: true, sortOrder: 2 },
    ]);
  }

  // 6. Daftar Layanan
  let [layanan] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'daftar-layanan'));
  if (!layanan) {
    [layanan] = await db.insert(contentCollections).values({
      name: 'Layanan Desa', slug: 'daftar-layanan', description: 'Daftar layanan administrasi online',
      mode: 'list', presentationType: 'cards', page: 'layanan', isSingleton: false,
    }).returning();
    await db.insert(contentFields).values([
      { collectionId: layanan.id, name: 'Nama Layanan', key: 'nama_layanan', type: 'text', isRequired: true, isPublic: true, sortOrder: 1 },
      { collectionId: layanan.id, name: 'Deskripsi Singkat', key: 'deskripsi', type: 'text', isRequired: true, isPublic: true, sortOrder: 2 },
      { collectionId: layanan.id, name: 'Tautan Formulir (Google Form)', key: 'tautan', type: 'url', isRequired: true, isPublic: true, sortOrder: 3 },
    ]);
  }

  // 7. EduVillage - PTS
  let [pts] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'daftar-pts'));
  if (!pts) {
    [pts] = await db.insert(contentCollections).values({
      name: 'Perguruan Tinggi Swasta (PTS)', slug: 'daftar-pts', description: 'Daftar kampus swasta di Sukabumi',
      mode: 'list', presentationType: 'cards', page: 'eduvillage', isSingleton: false,
    }).returning();
    await db.insert(contentFields).values([
      { collectionId: pts.id, name: 'Nama Kampus', key: 'nama_kampus', type: 'text', isRequired: true, isPublic: true, sortOrder: 1 },
      { collectionId: pts.id, name: 'Fokus Bidang', key: 'fokus_bidang', type: 'text', isRequired: true, isPublic: true, sortOrder: 2 },
      { collectionId: pts.id, name: 'Lokasi', key: 'lokasi', type: 'text', isRequired: true, isPublic: true, sortOrder: 3 },
      { collectionId: pts.id, name: 'Tautan Resmi', key: 'tautan', type: 'url', isRequired: false, isPublic: true, sortOrder: 4 },
    ]);
  }

  // 8. EduVillage - Beasiswa
  let [beasiswa] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'daftar-beasiswa'));
  if (!beasiswa) {
    [beasiswa] = await db.insert(contentCollections).values({
      name: 'Daftar Beasiswa', slug: 'daftar-beasiswa', description: 'Informasi beasiswa untuk warga desa',
      mode: 'list', presentationType: 'cards', page: 'eduvillage', isSingleton: false,
    }).returning();
    await db.insert(contentFields).values([
      { collectionId: beasiswa.id, name: 'Nama Beasiswa', key: 'nama_beasiswa', type: 'text', isRequired: true, isPublic: true, sortOrder: 1 },
      { collectionId: beasiswa.id, name: 'Penjelasan Singkat', key: 'deskripsi', type: 'text', isRequired: true, isPublic: true, sortOrder: 2 },
      { collectionId: beasiswa.id, name: 'Website Resmi', key: 'tautan', type: 'url', isRequired: false, isPublic: true, sortOrder: 3 },
    ]);
  }

  // 9. Kontak Desa
  let [kontak] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'kontak-desa'));
  if (!kontak) {
    [kontak] = await db.insert(contentCollections).values({
      name: 'Kontak & Alamat Desa', slug: 'kontak-desa', description: 'Informasi kontak yang tampil di footer / beranda',
      mode: 'singleton', presentationType: 'key_value', page: 'umum', isSingleton: true,
    }).returning();
    await db.insert(contentFields).values([
      { collectionId: kontak.id, name: 'Alamat Kantor', key: 'alamat', type: 'text', isRequired: true, isPublic: true, sortOrder: 1 },
      { collectionId: kontak.id, name: 'Email', key: 'email', type: 'text', isRequired: true, isPublic: true, sortOrder: 2 },
      { collectionId: kontak.id, name: 'Jam Pelayanan', key: 'jam_pelayanan', type: 'text', isRequired: true, isPublic: true, sortOrder: 3 },
      { collectionId: kontak.id, name: 'URL Peta (Google Maps)', key: 'peta', type: 'url', isRequired: false, isPublic: true, sortOrder: 4 },
    ]);
  }

  console.log("Seeding complete! Wadah (Collections & Fields) siap digunakan oleh Admin.");
}

seed().catch(console.error).finally(() => process.exit(0));
