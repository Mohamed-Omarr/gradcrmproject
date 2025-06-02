/*
  Warnings:

  - You are about to drop the column `sku` on the `cartitem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `sku`;

-- CreateIndex
CREATE UNIQUE INDEX `CartItem_productId_key` ON `CartItem`(`productId`);
