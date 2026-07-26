ALTER TABLE "content_collections" ADD COLUMN "mode" varchar(50) DEFAULT 'list' NOT NULL;--> statement-breakpoint
ALTER TABLE "content_collections" ADD COLUMN "presentation_type" varchar(50) DEFAULT 'list';--> statement-breakpoint
ALTER TABLE "content_fields" ADD COLUMN "unit" varchar(50);--> statement-breakpoint
ALTER TABLE "content_fields" ADD COLUMN "is_public" boolean DEFAULT true NOT NULL;