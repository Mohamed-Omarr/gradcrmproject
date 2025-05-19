/*
  Warnings:

  - You are about to drop the column `CartId` on the `cartitem` table. All the data in the column will be lost.
  - You are about to drop the column `cartItemId` on the `product` table. All the data in the column will be lost.
  - Added the required column `cartId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_CartId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_cartItemId_fkey`;

-- DropIndex
DROP INDEX `CartItem_CartId_fkey` ON `cartitem`;

-- DropIndex
DROP INDEX `Product_cartItemId_fkey` ON `product`;

-- AlterTable
ALTER TABLE `cart` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `CartId`,
    ADD COLUMN `cartId` INTEGER NOT NULL,
    ADD COLUMN `productId` INTEGER NOT NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL,
    ADD COLUMN `total` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `cartItemId`;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
