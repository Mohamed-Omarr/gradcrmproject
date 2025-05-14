-- CreateTable
CREATE TABLE `Wishlist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Wishlist_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_WishlistProducts` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_WishlistProducts_AB_unique`(`A`, `B`),
    INDEX `_WishlistProducts_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_WishlistProducts` ADD CONSTRAINT `_WishlistProducts_A_fkey` FOREIGN KEY (`A`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_WishlistProducts` ADD CONSTRAINT `_WishlistProducts_B_fkey` FOREIGN KEY (`B`) REFERENCES `Wishlist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
