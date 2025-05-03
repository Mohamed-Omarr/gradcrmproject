/*
  Warnings:

  - You are about to drop the column `adminId` on the `rating` table. All the data in the column will be lost.
  - Made the column `customerId` on table `rating` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `rating` DROP FOREIGN KEY `Rating_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `rating` DROP FOREIGN KEY `Rating_customerId_fkey`;

-- DropIndex
DROP INDEX `Rating_adminId_fkey` ON `rating`;

-- DropIndex
DROP INDEX `Rating_customerId_fkey` ON `rating`;

-- AlterTable
ALTER TABLE `rating` DROP COLUMN `adminId`,
    MODIFY `score` INTEGER NOT NULL,
    MODIFY `customerId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
