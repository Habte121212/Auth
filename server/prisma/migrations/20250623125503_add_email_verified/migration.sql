-- AlterTable
ALTER TABLE `user` ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `emailVerificationToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `emailVerificationToken_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `passwordResetToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `passwordResetToken_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `emailVerificationToken` ADD CONSTRAINT `emailVerificationToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `passwordResetToken` ADD CONSTRAINT `passwordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
