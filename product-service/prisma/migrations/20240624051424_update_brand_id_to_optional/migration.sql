-- DropForeignKey
ALTER TABLE "brand_image" DROP CONSTRAINT "brand_image_brandId_fkey";

-- AlterTable
ALTER TABLE "brand_image" ALTER COLUMN "brandId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "brand_image" ADD CONSTRAINT "brand_image_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;
