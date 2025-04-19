/*
  Warnings:

  - Added the required column `ownerId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `category` ADD COLUMN `ownerId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `stock` ADD COLUMN `ownerId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
