/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `product_image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "product_image" ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "product_image_name_key" ON "product_image"("name");
