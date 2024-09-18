ALTER TABLE "reviews" ALTER COLUMN "rating" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN IF EXISTS "name";