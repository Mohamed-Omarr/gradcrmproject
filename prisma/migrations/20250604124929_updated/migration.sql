/*
  Warnings:

  - You are about to drop the column `total` on the `cartitem` table. All the data in the column will be lost.
  - You are about to drop the column `isWishListed` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `total`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `isWishListed`;

-- AddForeignKey
ALTER TABLE `WishlistItems` ADD CONSTRAINT `WishlistItems_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WishlistItems` ADD CONSTRAINT `WishlistItems_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
