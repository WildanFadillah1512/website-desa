CREATE INDEX IF NOT EXISTS "content_collections_page_idx" ON "content_collections" ("page");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "content_fields_collection_sort_idx" ON "content_fields" ("collection_id", "sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "content_entries_collection_created_idx" ON "content_entries" ("collection_id", "created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "content_entries_collection_status_idx" ON "content_entries" ("collection_id", "status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "berita_status_published_idx" ON "berita" ("status", "published_at");
