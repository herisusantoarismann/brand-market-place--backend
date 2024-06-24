/*
  Warnings:

  - You are about to drop the column `author` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `brand_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `product_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `whislists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "brand_image" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "product_image" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "author",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "whislists" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
