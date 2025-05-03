-- DropForeignKey
ALTER TABLE `rating` DROP FOREIGN KEY `Rating_customerId_fkey`;

-- DropIndex
DROP INDEX `Rating_customerId_fkey` ON `rating`;

-- AlterTable
ALTER TABLE `rating` ADD COLUMN `adminId` VARCHAR(191) NULL,
    MODIFY `customerId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
