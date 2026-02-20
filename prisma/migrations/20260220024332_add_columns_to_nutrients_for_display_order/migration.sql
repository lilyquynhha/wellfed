-- AlterTable
ALTER TABLE "nutrients"
  ADD COLUMN "display_order" integer NOT NULL,
  ADD COLUMN "serving_name" varchar(100) NOT NULL,
  ADD COLUMN "unit" varchar(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "unique_nutrients_serving_name" ON "nutrients"("serving_name");

-- CreateIndex
CREATE UNIQUE INDEX "unique_nutrients_display_order" ON "nutrients"("display_order");

