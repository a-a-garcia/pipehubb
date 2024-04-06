-- AlterTable
ALTER TABLE `tasklist` ADD COLUMN `important` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `taskupdates` ADD COLUMN `important` BOOLEAN NULL DEFAULT false;
