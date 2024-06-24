/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `brand_image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "brand_image" ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "brand_image_name_key" ON "brand_image"("name");
