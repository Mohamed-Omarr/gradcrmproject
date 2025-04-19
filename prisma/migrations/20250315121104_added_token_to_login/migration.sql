/*
  Warnings:

  - You are about to drop the column `email` on the `login` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `login` table. All the data in the column will be lost.
  - The required column `id` was added to the `Login` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `token` to the `Login` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Login` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userType` to the `Login` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Login_email_key` ON `login`;

-- AlterTable
ALTER TABLE `login` DROP COLUMN `email`,
    DROP COLUMN `password`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `token` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    ADD COLUMN `userType` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
