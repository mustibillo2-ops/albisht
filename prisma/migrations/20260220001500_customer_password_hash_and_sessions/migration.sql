-- Backfill missing emails before enforcing NOT NULL
UPDATE `user`
SET `email` = CONCAT('user', `id`, '@albisht.local')
WHERE `email` IS NULL OR `email` = '';

-- Add passwordHash and backfill from existing password column
ALTER TABLE `user`
  ADD COLUMN `passwordHash` VARCHAR(191) NULL;

UPDATE `user`
SET `passwordHash` = `password`
WHERE `passwordHash` IS NULL AND `password` IS NOT NULL;

-- Fallback hash for unexpected empty values
UPDATE `user`
SET `passwordHash` = '$2a$10$Wr8OjisSFbAZ0m6W7akI7.qiobUlyRUtLR/mMayNWqnVhKMOaiODy'
WHERE `passwordHash` IS NULL OR `passwordHash` = '';

-- Apply final user schema
ALTER TABLE `user`
  MODIFY `email` VARCHAR(191) NOT NULL,
  MODIFY `passwordHash` VARCHAR(191) NOT NULL,
  DROP COLUMN `password`;

-- Phone should be reusable by business rules
DROP INDEX `User_phone_key` ON `user`;

-- Attach orders to signed-in users
ALTER TABLE `Order`
  ADD COLUMN `userId` INTEGER NULL;

CREATE INDEX `Order_userId_idx` ON `Order`(`userId`);

ALTER TABLE `Order`
  ADD CONSTRAINT `Order_userId_fkey`
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

