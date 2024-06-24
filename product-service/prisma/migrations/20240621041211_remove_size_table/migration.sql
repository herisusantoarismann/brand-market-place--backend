/*
  Warnings:

  - You are about to drop the `sizes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sizes` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sizes" DROP CONSTRAINT "sizes_productId_fkey";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "sizes" JSONB NOT NULL;

-- DropTable
DROP TABLE "sizes";
