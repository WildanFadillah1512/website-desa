import { db } from "../src/db";
import { contentCollections, contentFields, contentEntries } from "../src/db/schema";
import { eq, inArray } from "drizzle-orm";

async function upsertCollection(slug: string, name: string, description: string, page: string, mode: string, presentationType: string) {
  const [existing] = await db.select().from(contentCollections).where(eq(contentCollections.slug, slug));
  if (existing) return existing;
  const [inserted] = await db.insert(contentCollections).values({
    slug, name, description, page, mode, presentationType, isSingleton: mode === 'singleton'
  }).returning();
  return inserted;
}

async function run() {
  console.log("Seeding konten beranda yang dapat diedit admin...\n");

  // ── 1. Identitas Desa (untuk nama desa, visi misi di hero) ─────────────
  // sudah ada, cek
  let [identitas] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'identitas-desa'));
  if (identitas) {
    // Pastikan ada field 'slogan' (visi di hero)
    const fields = await db.select().from(contentFields).where(eq(contentFields.collectionId, identitas.id));
    const hasSlogan = fields.find(f => f.key === 'slogan');
    if (!hasSlogan) {
      await db.insert(contentFields).values([
        { collectionId: identitas.id, name: 'Slogan / Tagline Hero', key: 'slogan', type: 'textarea', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 10 },
        { collectionId: identitas.id, name: 'Jumlah Penduduk (Jiwa)', key: 'jumlah_penduduk', type: 'number', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 11 },
        { collectionId: identitas.id, name: 'Jumlah Kepala Keluarga', key: 'jumlah_kk', type: 'number', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 12 },
      ]);
      console.log("  ✅ Tambah field slogan & statistik ke identitas-desa");
    }
  }

  // ── 2. Sambutan Kepala Desa ─────────────────────────────────────────────
  const sambutan = await upsertCollection('sambutan-kepala-desa', 'Sambutan Kepala Desa', 'Sambutan yang tampil di beranda', 'beranda', 'singleton', 'rich_text');
  const sambutanFields = await db.select().from(contentFields).where(eq(contentFields.collectionId, sambutan.id));
  if (sambutanFields.length === 0) {
    await db.insert(contentFields).values([
      { collectionId: sambutan.id, name: 'Judul Sambutan', key: 'judul', type: 'text', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 1 },
      { collectionId: sambutan.id, name: 'Isi Kutipan / Sambutan', key: 'isi_sambutan', type: 'textarea', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 2 },
      { collectionId: sambutan.id, name: 'Nama Kepala Desa', key: 'nama_kepala_desa', type: 'text', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 3 },
      { collectionId: sambutan.id, name: 'Jabatan', key: 'jabatan', type: 'text', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 4 },
      { collectionId: sambutan.id, name: 'Foto Kepala Desa (URL)', key: 'foto_url', type: 'image', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 5 },
    ]);
    // Seed default data
    const [idDesa] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'identitas-desa'));
    const [idEntry] = idDesa ? await db.select().from(contentEntries).where(eq(contentEntries.collectionId, idDesa.id)) : [null];
    const desaName = (idEntry?.data as any)?.nama_desa || 'Cikahuripan';
    await db.insert(contentEntries).values({
      collectionId: sambutan.id,
      data: {
        judul: `Bersama Membangun Desa ${desaName} yang Lebih Baik`,
        isi_sambutan: 'Pemerintahan desa berkomitmen penuh untuk memberikan layanan publik yang transparan, cepat, dan mudah diakses. Website ini hadir sebagai wujud nyata inovasi digital untuk mendekatkan pelayanan kepada seluruh warga masyarakat.',
        nama_kepala_desa: 'Bpk. H. Ujang Supriatna, S.IP.',
        jabatan: `Kepala Desa ${desaName}`,
        foto_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop',
      },
      status: 'published',
    });
    console.log("  ✅ Buat koleksi + field sambutan-kepala-desa");
  }

  // ── 3. Layanan / Checklist di beranda ──────────────────────────────────
  const layananBeranda = await upsertCollection('layanan-beranda', 'Daftar Layanan (Beranda)', 'Checklist layanan yang tampil di beranda', 'beranda', 'list', 'list');
  const lbFields = await db.select().from(contentFields).where(eq(contentFields.collectionId, layananBeranda.id));
  if (lbFields.length === 0) {
    await db.insert(contentFields).values([
      { collectionId: layananBeranda.id, name: 'Nama Layanan', key: 'nama_layanan', type: 'text', isRequired: true, isPublic: true, isDeletable: false, isSystem: true, sortOrder: 1 },
    ]);
    // Seed default data
    const defaultLayanan = ['Pengantar SKCK', 'Surat Keterangan Domisili', 'Surat Keterangan Tidak Mampu', 'Surat Pengantar KTP / KK'];
    for (const nama of defaultLayanan) {
      await db.insert(contentEntries).values({ collectionId: layananBeranda.id, data: { nama_layanan: nama }, status: 'published' });
    }
    console.log("  ✅ Buat koleksi + field + data layanan-beranda");
  }

  // ── 4. Kontak Desa ─────────────────────────────────────────────────────
  let [kontakCol] = await db.select().from(contentCollections).where(eq(contentCollections.slug, 'kontak-desa'));
  if (kontakCol) {
    const kontakFields = await db.select().from(contentFields).where(eq(contentFields.collectionId, kontakCol.id));
    const hasTelepon = kontakFields.find(f => f.key === 'telepon');
    const hasEmail = kontakFields.find(f => f.key === 'email');
    const hasJam = kontakFields.find(f => f.key === 'jam_pelayanan');
    if (!hasTelepon) {
      let sortOrder = (kontakFields.length ?? 0) + 1;
      const toInsert = [];
      if (!hasTelepon) toInsert.push({ collectionId: kontakCol.id, name: 'Nomor Telepon', key: 'telepon', type: 'text', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: sortOrder++ });
      if (!hasEmail) toInsert.push({ collectionId: kontakCol.id, name: 'Email', key: 'email', type: 'text', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: sortOrder++ });
      if (!hasJam) toInsert.push({ collectionId: kontakCol.id, name: 'Jam Pelayanan', key: 'jam_pelayanan', type: 'text', isRequired: false, isPublic: true, isDeletable: false, isSystem: true, sortOrder: sortOrder++ });
      if (toInsert.length > 0) await db.insert(contentFields).values(toInsert);
      console.log("  ✅ Tambah field telepon/email/jam ke kontak-desa");
    }
  }

  console.log("\nSeed selesai! Silakan reload admin panel.");
}

run().catch(console.error).finally(() => process.exit(0));
