import { pgTable, serial, text, timestamp, boolean, jsonb, varchar, integer, index } from "drizzle-orm/pg-core";

// --- CORE: Users & Auth ---
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- CORE: Hybrid CMS Architecture ---
// 1. Collections: Define a new content type (e.g., 'profil-desa', 'potensi-desa', 'statistik')
export const contentCollections = pgTable("content_collections", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  page: varchar("page", { length: 255 }).default("umum").notNull(), // To which page this collection belongs (e.g., 'profil', 'beranda', 'layanan')
  mode: varchar("mode", { length: 50 }).default("list").notNull(), // singleton, list, dataset
  presentationType: varchar("presentation_type", { length: 50 }).default("list"), // key_value, rich_text, list, table, statistics, cards, chart, mixed
  isSingleton: boolean("is_singleton").default(false).notNull(), // Keep for backwards compatibility
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  pageIdx: index("content_collections_page_idx").on(table.page),
}));

// 2. Fields: Define the structure (schema) for a collection
export const contentFields = pgTable("content_fields", {
  id: serial("id").primaryKey(),
  collectionId: integer("collection_id").references(() => contentCollections.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., 'title', 'body', 'image_url'
  key: varchar("key", { length: 255 }).notNull(), // e.g., 'title', 'body', 'image_url'
  type: varchar("type", { length: 50 }).notNull(), // text, richtext, image, number, date, boolean
  unit: varchar("unit", { length: 50 }),
  isRequired: boolean("is_required").default(false).notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
  isDeletable: boolean("is_deletable").default(true).notNull(),
  isSystem: boolean("is_system").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
}, (table) => ({
  collectionSortIdx: index("content_fields_collection_sort_idx").on(table.collectionId, table.sortOrder),
}));

// 3. Entries: The actual data stored as JSONB
export const contentEntries = pgTable("content_entries", {
  id: serial("id").primaryKey(),
  collectionId: integer("collection_id").references(() => contentCollections.id, { onDelete: "cascade" }).notNull(),
  data: jsonb("data").notNull(), // Key-value pairs matching contentFields
  status: varchar("status", { length: 50 }).notNull().default("published"), // draft, published, archived
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  collectionCreatedIdx: index("content_entries_collection_created_idx").on(table.collectionId, table.createdAt),
  collectionStatusIdx: index("content_entries_collection_status_idx").on(table.collectionId, table.status),
}));


// --- STANDARD MODULES ---
// Berita & Artikel
export const berita = pgTable("berita", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
  status: varchar("status", { length: 50 }).notNull().default("draft"), // draft, published
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  statusPublishedIdx: index("berita_status_published_idx").on(table.status, table.publishedAt),
}));

// Sistem Pengaduan Masyarakat
export const pengaduan = pgTable("pengaduan", {
  id: serial("id").primaryKey(),
  trackingCode: varchar("tracking_code", { length: 50 }).notNull().unique(), // Untuk warga mengecek status tanpa login
  namaPelapor: varchar("nama_pelapor", { length: 255 }).notNull(),
  nik: varchar("nik", { length: 20 }), // Opsional jika ingin rahasia
  kontak: varchar("kontak", { length: 255 }), // Nomor HP / Email
  kategori: varchar("kategori", { length: 100 }).notNull(),
  isiLaporan: text("isi_laporan").notNull(),
  lampiranUrl: text("lampiran_url"), // URL file bukti
  status: varchar("status", { length: 50 }).notNull().default("menunggu"), // menunggu, diproses, selesai, ditolak
  tanggapan: text("tanggapan"),
  isPublic: boolean("is_public").default(false).notNull(), // Apakah boleh ditampilkan di halaman publik anonim?
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
