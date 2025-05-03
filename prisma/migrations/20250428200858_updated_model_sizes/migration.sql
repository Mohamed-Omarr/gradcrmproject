/*
  Warnings:

  - You are about to drop the column `Code` on the `sizes` table. All the data in the column will be lost.
  - Added the required column `code` to the `Sizes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Sizes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sizes` DROP COLUMN `Code`,
    ADD COLUMN `code` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
