/*
  Warnings:

  - You are about to drop the column `Code` on the `colors` table. All the data in the column will be lost.
  - Added the required column `code` to the `Colors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `colors` DROP COLUMN `Code`,
    ADD COLUMN `code` VARCHAR(191) NOT NULL;
