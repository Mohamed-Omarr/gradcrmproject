/*
  Warnings:

  - You are about to alter the column `qty` on the `product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `qty` INTEGER NOT NULL;
