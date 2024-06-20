/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `address_book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `address_book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address_book" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "address_book_userId_key" ON "address_book"("userId");
