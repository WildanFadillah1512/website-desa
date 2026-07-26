import "dotenv/config";
import { db } from "../src/db";
import { contentCollections, contentEntries, contentFields } from "../src/db/schema";
import { eq, inArray } from "drizzle-orm";

const LAYANAN_LIST = [
  {
    name: 'Pengantar SKCK',
    slug: 'layanan-pengantar-skck',
    description: 'Formulir pengajuan surat pengantar SKCK',
  },
  {
    name: 'Surat Keterangan Domisili',
    slug: 'layanan-keterangan-domisili',
    description: 'Formulir pengajuan surat keterangan domisili',
  },
  {
    name: 'Surat Keterangan Tidak Mampu',
    slug: 'layanan-keterangan-tidak-mampu',
    description: 'Formulir pengajuan surat keterangan tidak mampu (SKTM)',
  },
  {
    name: 'Surat Pengantar KTP / KK',
    slug: 'layanan-pengantar-ktp-kk',
    description: 'Formulir pengajuan surat pengantar KTP / Kartu Keluarga',
  },
];

async function run() {
  console.log("Rolling back to Singleton layanan...\n");

  // 1. Delete the old list collection layanan-desa
  const [old] = await db.select().from(contentCollections).where(eq(contentCollections.slug, "layanan-desa"));
  if (old) {
    await db.delete(contentEntries).where(eq(contentEntries.collectionId, old.id));
    await db.delete(contentFields).where(eq(contentFields.collectionId, old.id));
    await db.delete(contentCollections).where(eq(contentCollections.id, old.id));
    console.log("✅ Deleted layanan-desa list collection.");
  }

  // 2. Also clean old singleton slugs if they still exist
  const oldSlugs = ['surat-keterangan-usaha', 'surat-pengantar-nikah', 'surat-keterangan-tidak-mampu'];
  const oldCols = await db.select().from(contentCollections).where(inArray(contentCollections.slug, oldSlugs));
  if (oldCols.length > 0) {
    const ids = oldCols.map(c => c.id);
    await db.delete(contentEntries).where(inArray(contentEntries.collectionId, ids));
    await db.delete(contentFields).where(inArray(contentFields.collectionId, ids));
    await db.delete(contentCollections).where(inArray(contentCollections.id, ids));
    console.log(`✅ Cleaned up ${oldCols.length} old singleton(s).`);
  }

  // 3. Create new singletons for each layanan
  for (const l of LAYANAN_LIST) {
    const [existing] = await db.select().from(contentCollections).where(eq(contentCollections.slug, l.slug));
    if (existing) {
      console.log(`   Skipping (already exists): ${l.name}`);
      continue;
    }

    const [col] = await db.insert(contentCollections).values({
      name: l.name,
      slug: l.slug,
      description: l.description,
      page: 'layanan',
      mode: 'singleton',
      presentationType: 'key_value',
      isSingleton: true,
    }).returning();

    await db.insert(contentFields).values([
      { collectionId: col.id, name: 'Deskripsi Singkat', key: 'deskripsi', type: 'textarea', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 1 },
      { collectionId: col.id, name: 'Tautan / Link Formulir', key: 'link', type: 'url', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 2 },
    ]);

    await db.insert(contentEntries).values({
      collectionId: col.id,
      data: {
        deskripsi: 'Ajukan permohonan secara online dengan mengklik tautan di bawah.',
        link: 'https://wildan-fadillah.netlify.app/',
      },
      status: 'published',
    });

    console.log(`✅ Created singleton: ${l.name}`);
  }

  console.log("\n✅ Rollback selesai!");
}

run().catch(console.error).finally(() => process.exit(0));
