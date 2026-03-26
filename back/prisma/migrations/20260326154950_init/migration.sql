/*
  Warnings:

  - You are about to drop the column `amount` on the `bill` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `bill` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `bill` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `price` on the `bill` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - Added the required column `categoryId` to the `bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bill` DROP COLUMN `amount`,
    DROP COLUMN `category`,
    ADD COLUMN `categoryId` BIGINT NOT NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `name` VARCHAR(50) NOT NULL,
    MODIFY `price` DECIMAL(10, 2) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `category` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `authorId` BIGINT NOT NULL,

    UNIQUE INDEX `category_name_authorId_key`(`name`, `authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `bill_categoryId_idx` ON `bill`(`categoryId`);

-- AddForeignKey
ALTER TABLE `bill` ADD CONSTRAINT `bill_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `bill` RENAME INDEX `bill_authorId_fkey` TO `bill_authorId_idx`;
