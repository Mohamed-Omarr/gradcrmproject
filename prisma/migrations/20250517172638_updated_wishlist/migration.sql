/*
  Warnings:

  - Added the required column `sku` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cartitem` ADD COLUMN `sku` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `isWishListed` BOOLEAN NOT NULL DEFAULT false;
