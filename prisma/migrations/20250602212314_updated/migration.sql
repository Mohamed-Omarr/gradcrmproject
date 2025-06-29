/*
  Warnings:

  - A unique constraint covering the columns `[customerId,productId]` on the table `WishlistItems` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `wishlistitems` DROP FOREIGN KEY `WishlistItems_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlistitems` DROP FOREIGN KEY `WishlistItems_productId_fkey`;

-- DropIndex
DROP INDEX `WishlistItems_customerId_key` ON `wishlistitems`;

-- DropIndex
DROP INDEX `WishlistItems_productId_key` ON `wishlistitems`;

-- CreateIndex
CREATE UNIQUE INDEX `WishlistItems_customerId_productId_key` ON `WishlistItems`(`customerId`, `productId`);


