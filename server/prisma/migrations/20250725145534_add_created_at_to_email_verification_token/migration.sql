-- AlterTable
ALTER TABLE `emailverificationtoken` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
