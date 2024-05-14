/*
  Warnings:

  - Added the required column `userId` to the `TaskUpdates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `taskupdates` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TaskUpdates` ADD CONSTRAINT `TaskUpdates_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
