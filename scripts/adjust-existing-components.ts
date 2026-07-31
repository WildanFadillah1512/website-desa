import "dotenv/config";
import { db } from "../src/db";
import { contentCollections, contentFields, contentEntries } from "../src/db/schema";
import { eq, notInArray } from "drizzle-orm";

const systemCollections = [
  'identitas-desa',
  'informasi-wilayah',
  'sambutan-kepala-desa',
  'pengaturan-beranda',
  'kontak-desa',
  'layanan-desa',
  'profil-desa',
  'daftar-beasiswa',
  'daftar-pts',
  'data-pekerjaan',
  'kampus',
  'layanan-pengantar-skck',
  'layanan-keterangan-domisili',
  'layanan-keterangan-tidak-mampu',
  'layanan-pengantar-ktp-kk'
];

const PAGE_INDUK_SLUGS: Record<string, string> = {
  beranda: 'sambutan-kepala-desa',
  profil: 'identitas-desa',
  layanan: 'daftar-layanan',
  eduvillage: 'daftar-pts',
  'data-penduduk': 'data-pekerjaan',
  umum: 'kontak-desa',
};

async function adjust() {
  console.log("Memulai penyesuaian data komponen...");

  const userCollections = await db
    .select()
    .from(contentCollections)
    .where(notInArray(contentCollections.slug, systemCollections));

  console.log(`Ditemukan ${userCollections.length} komponen buatan user.`);

  for (const col of userCollections) {
    const indukSlug = PAGE_INDUK_SLUGS[col.page];
    if (!indukSlug) {
      console.log(`- Melewati ${col.name} (${col.slug}): Tidak ada induk untuk halaman '${col.page}'.`);
      continue;
    }

    const [induk] = await db.select().from(contentCollections).where(eq(contentCollections.slug, indukSlug));
    if (!induk) {
      console.log(`- Melewati ${col.name} (${col.slug}): Komponen induk '${indukSlug}' tidak ditemukan.`);
      continue;
    }

    const indukFields = await db.select().from(contentFields).where(eq(contentFields.collectionId, induk.id));
    
    if (indukFields.length > 0) {
      // Delete existing fields
      await db.delete(contentFields).where(eq(contentFields.collectionId, col.id));
      
      // Copy from induk
      await db.insert(contentFields).values(
        indukFields.map((f) => ({
          collectionId: col.id,
          name: f.name,
          key: f.key,
          type: f.type,
          unit: f.unit,
          isRequired: f.isRequired,
          isPublic: f.isPublic,
          isDeletable: f.isDeletable,
          isSystem: f.isSystem, // they requested to exactly follow the induk
          sortOrder: f.sortOrder,
        }))
      );

      console.log(`- Berhasil memperbarui fields untuk ${col.name} (${col.slug}) mengikuti ${induk.name}.`);
    } else {
      console.log(`- Melewati ${col.name} (${col.slug}): Induk '${indukSlug}' tidak memiliki fields.`);
    }
  }

  console.log("Selesai menyesuaikan data.");
  process.exit(0);
}

adjust().catch(console.error);
