import { inArray, eq, desc } from "drizzle-orm";
import { db } from "@/db";
import {
  berita,
  contentCollections,
  contentEntries,
  contentFields,
} from "@/db/schema";

const CMS_CACHE_SECONDS = 60;
const CMS_CACHE_TTL_MS = CMS_CACHE_SECONDS * 1000;
const cmsCache = new Map<string, { expiresAt: number; value: unknown }>();

export type CollectionData = Record<string, string>;

export type CollectionSection = {
  collection: typeof contentCollections.$inferSelect;
  fields: (typeof contentFields.$inferSelect)[];
  entries: (typeof contentEntries.$inferSelect)[];
};

async function remember<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const cached = cmsCache.get(key);
  if (cached && cached.expiresAt > now) return cached.value as T;

  const value = await loader();
  cmsCache.set(key, { value, expiresAt: now + CMS_CACHE_TTL_MS });
  return value;
}

export function invalidateCmsCache() {
  cmsCache.clear();
}

export async function getCollectionDataMap(
  slugs: string[]
): Promise<Record<string, CollectionData>> {
  const uniqueSlugs = [...new Set(slugs)].sort();
  return remember(`collection-data:${uniqueSlugs.join(",")}`, async () => {
    if (slugs.length === 0) return {};

    const collections = await db
      .select()
      .from(contentCollections)
      .where(inArray(contentCollections.slug, uniqueSlugs));

    if (collections.length === 0) return {};

    const entries = await db
      .select()
      .from(contentEntries)
      .where(inArray(contentEntries.collectionId, collections.map((col) => col.id)))
      .orderBy(contentEntries.createdAt);

    const firstEntryByCollection = new Map<number, typeof entries[number]>();
    for (const entry of entries) {
      if (!firstEntryByCollection.has(entry.collectionId)) {
        firstEntryByCollection.set(entry.collectionId, entry);
      }
    }

    return collections.reduce<Record<string, CollectionData>>((acc, col) => {
      acc[col.slug] = (firstEntryByCollection.get(col.id)?.data ?? {}) as CollectionData;
      return acc;
    }, {});
  });
}

export async function getCollectionData(slug: string): Promise<CollectionData> {
  const data = await getCollectionDataMap([slug]);
  return data[slug] ?? {};
}

export async function getPageSections(page: string): Promise<CollectionSection[]> {
  return remember(`page-sections:${page}`, async () => {
    const collections = await db
      .select()
      .from(contentCollections)
      .where(eq(contentCollections.page, page))
      .orderBy(contentCollections.name);

    if (collections.length === 0) return [];

    const collectionIds = collections.map((collection) => collection.id);

    const [fields, entries] = await Promise.all([
      db
        .select()
        .from(contentFields)
        .where(inArray(contentFields.collectionId, collectionIds))
        .orderBy(contentFields.sortOrder),
      db
        .select()
        .from(contentEntries)
        .where(inArray(contentEntries.collectionId, collectionIds))
        .orderBy(contentEntries.createdAt),
    ]);

    return collections.map((collection) => ({
      collection,
      fields: fields.filter((field) => field.collectionId === collection.id),
      entries: entries.filter((entry) => entry.collectionId === collection.id),
    }));
  });
}

export async function getLatestNews(limit = 3) {
  return remember(`latest-news:${limit}`, async () => {
    return db
      .select()
      .from(berita)
      .where(eq(berita.status, "published"))
      .orderBy(desc(berita.publishedAt))
      .limit(limit);
  });
}

export async function getPublishedNews() {
  return remember("published-news", async () => {
    return db
      .select()
      .from(berita)
      .where(eq(berita.status, "published"))
      .orderBy(desc(berita.publishedAt));
  });
}

export async function getNewsBySlug(slug: string) {
  return remember(`news-by-slug:${slug}`, async () => {
    const [article] = await db
      .select()
      .from(berita)
      .where(eq(berita.slug, slug))
      .limit(1);

    return article ?? null;
  });
}
