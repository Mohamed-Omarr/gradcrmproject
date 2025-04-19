-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `confirmPassword` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Admin_id_key`(`id`),
    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
