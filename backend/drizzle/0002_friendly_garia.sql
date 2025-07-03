CREATE TABLE "cloudinary_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_id" text NOT NULL,
	"media_url" text NOT NULL,
	"resource_type" text NOT NULL,
	"user_id" text NOT NULL,
	"upload_timestamp" timestamp DEFAULT now(),
	CONSTRAINT "cloudinary_files_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
ALTER TABLE "tour_steps" ADD COLUMN "video_url" text;