import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { contentCollections, contentFields, contentEntries } from './src/db/schema';
import { eq } from 'drizzle-orm';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString!, { max: 1, ssl: 'require' });
const db = drizzle(client);

async function seedContent() {
  console.log("Seeding CMS Content...");
  
  try {
    // 1. Profil Desa (Singleton)
    let [profilCollection] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'profil-desa')).limit(1);
    if (!profilCollection) {
      [profilCollection] = await db.insert(contentCollections).values({
        name: 'Profil Desa',
        slug: 'profil-desa',
        description: 'Informasi Sejarah, Visi, Misi, dan Wilayah Desa',
        isSingleton: true,
      }).returning();
      
      await db.insert(contentFields).values([
        { collectionId: profilCollection.id, name: 'Nama Desa', key: 'nama', type: 'text', isRequired: true, sortOrder: 0 },
        { collectionId: profilCollection.id, name: 'Sejarah Desa', key: 'sejarah', type: 'richtext', isRequired: true, sortOrder: 1 },
        { collectionId: profilCollection.id, name: 'Visi', key: 'visi', type: 'textarea', isRequired: true, sortOrder: 2 },
        { collectionId: profilCollection.id, name: 'Misi', key: 'misi', type: 'richtext', isRequired: true, sortOrder: 3 },
        { collectionId: profilCollection.id, name: 'Luas Wilayah (Ha)', key: 'luas_wilayah', type: 'text', isRequired: true, sortOrder: 4 },
        { collectionId: profilCollection.id, name: 'Jumlah Penduduk', key: 'jumlah_penduduk', type: 'text', isRequired: true, sortOrder: 5 },
      ]);
      
      await db.insert(contentEntries).values({
        collectionId: profilCollection.id,
        data: {
          nama: 'Desa Cikahuripan',
          sejarah: 'Desa Cikahuripan adalah sebuah desa yang terletak di Kecamatan Kadudampit, Kabupaten Sukabumi...',
          visi: 'Terwujudnya Desa yang Religius, Mandiri, Maju, dan Sejahtera melalui Tata Kelola Pemerintahan yang Baik serta Pemberdayaan Potensi Lokal.',
          misi: '<ol><li>Meningkatkan perekonomian masyarakat desa...</li><li>Meningkatkan kualitas sumber daya manusia...</li></ol>',
          luas_wilayah: '1.640,62',
          jumlah_penduduk: '7.903'
        },
        status: 'published'
      });
      console.log("Profil Desa seeded.");
    }

    // 2. EduVillage - Daftar Kampus
    let [kampusCollection] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'kampus')).limit(1);
    if (!kampusCollection) {
      [kampusCollection] = await db.insert(contentCollections).values({
        name: 'EduVillage - Direktori Kampus',
        slug: 'kampus',
        description: 'Daftar Perguruan Tinggi di Sukabumi',
        isSingleton: false,
      }).returning();
      
      await db.insert(contentFields).values([
        { collectionId: kampusCollection.id, name: 'Nama Kampus', key: 'nama', type: 'text', isRequired: true, sortOrder: 0 },
        { collectionId: kampusCollection.id, name: 'Fokus Bidang', key: 'fokus', type: 'text', isRequired: true, sortOrder: 1 },
        { collectionId: kampusCollection.id, name: 'Lokasi', key: 'lokasi', type: 'text', isRequired: true, sortOrder: 2 },
        { collectionId: kampusCollection.id, name: 'Website / Info Beasiswa', key: 'website', type: 'text', isRequired: false, sortOrder: 3 },
      ]);
      
      await db.insert(contentEntries).values([
        { collectionId: kampusCollection.id, data: { nama: 'Universitas Muhammadiyah Sukabumi (UMMI)', fokus: 'Sains & Teknologi, Keguruan, Pertanian, Ekonomi, dsb.', lokasi: 'Jl. R. Syamsudin, S.H. No. 50, Kota Sukabumi', website: 'UMMI — Info Beasiswa' }, status: 'published' },
        { collectionId: kampusCollection.id, data: { nama: 'Universitas Nusa Putra', fokus: 'Teknik, Komputer, Bisnis, Hukum, Keguruan', lokasi: 'Jl. Raya Cibolang No. 21, Cisaat, Kab. Sukabumi', website: 'Universitas Nusa Putra — Info Beasiswa' }, status: 'published' },
        { collectionId: kampusCollection.id, data: { nama: 'Universitas BSI Kampus Sukabumi', fokus: 'Teknologi Informasi, Ilmu Komputer, Manajemen', lokasi: 'Jl. Cendana No. 222, Cikole, Kota Sukabumi', website: 'Universitas BSI Sukabumi' }, status: 'published' },
      ]);
      console.log("EduVillage Kampus seeded.");
    }

    // 3. Layanan Desa (Link Google Forms)
    let [layananCollection] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'layanan-desa')).limit(1);
    if (!layananCollection) {
      [layananCollection] = await db.insert(contentCollections).values({
        name: 'Layanan Desa Online',
        slug: 'layanan-desa',
        description: 'Daftar link formulir pelayanan surat desa',
        isSingleton: false,
      }).returning();
      
      await db.insert(contentFields).values([
        { collectionId: layananCollection.id, name: 'Nama Layanan', key: 'nama', type: 'text', isRequired: true, sortOrder: 0 },
        { collectionId: layananCollection.id, name: 'Tautan Google Form', key: 'link', type: 'text', isRequired: true, sortOrder: 1 },
      ]);
      
      await db.insert(contentEntries).values([
        { collectionId: layananCollection.id, data: { nama: 'Surat Keterangan Usaha', link: 'https://docs.google.com/forms/d/e/1FAIpQLSe-...' }, status: 'published' },
        { collectionId: layananCollection.id, data: { nama: 'Surat Pengantar Nikah', link: 'https://docs.google.com/forms/d/e/1FAIpQLSc-...' }, status: 'published' },
        { collectionId: layananCollection.id, data: { nama: 'Surat Keterangan Tidak Mampu (SKTM)', link: 'https://docs.google.com/forms/d/e/1FAIpQLSd-...' }, status: 'published' },
      ]);
      console.log("Layanan Desa seeded.");
    }

  } catch (err) {
    console.error("Seeding content failed:", err);
  } finally {
    await client.end();
    process.exit(0);
  }
}

seedContent();
