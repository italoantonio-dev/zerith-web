ALTER TABLE "product" ADD COLUMN "image_asset_id" text;
--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_image_asset_id_media_asset_id_fk" FOREIGN KEY ("image_asset_id") REFERENCES "public"."media_asset"("id") ON DELETE set null ON UPDATE no action;
