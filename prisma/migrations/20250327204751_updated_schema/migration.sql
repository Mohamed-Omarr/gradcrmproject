/*
  Warnings:

  - You are about to drop the column `total_product` on the `category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `category` DROP COLUMN `total_product`;

-- AlterTable
ALTER TABLE `stock` ADD COLUMN `description` VARCHAR(191) NULL;
