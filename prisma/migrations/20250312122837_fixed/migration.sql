/*
  Warnings:

  - You are about to drop the column `confirmPassword` on the `admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `admin` DROP COLUMN `confirmPassword`;

-- CreateTable
CREATE TABLE `login` (
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `login_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `register` (
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `confirmPassword` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `register_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- RenameIndex
ALTER TABLE `admin` RENAME INDEX `Admin_email_key` TO `admin_email_key`;

-- RenameIndex
ALTER TABLE `admin` RENAME INDEX `Admin_id_key` TO `admin_id_key`;
