-- AlterTable
ALTER TABLE `user` ADD COLUMN `phone` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `passwordHash` VARCHAR(191) NULL;
