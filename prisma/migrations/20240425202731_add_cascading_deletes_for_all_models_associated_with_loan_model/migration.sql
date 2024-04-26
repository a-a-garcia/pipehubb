-- DropForeignKey
ALTER TABLE `activitylog` DROP FOREIGN KEY `ActivityLog_loanId_fkey`;

-- DropForeignKey
ALTER TABLE `documentchecklist` DROP FOREIGN KEY `DocumentChecklist_loanId_fkey`;

-- DropForeignKey
ALTER TABLE `filenotes` DROP FOREIGN KEY `FileNotes_loanId_fkey`;

-- DropForeignKey
ALTER TABLE `tasklist` DROP FOREIGN KEY `TaskList_loanId_fkey`;

-- DropForeignKey
ALTER TABLE `taskupdates` DROP FOREIGN KEY `TaskUpdates_taskListId_fkey`;

-- AddForeignKey
ALTER TABLE `ActivityLog` ADD CONSTRAINT `ActivityLog_loanId_fkey` FOREIGN KEY (`loanId`) REFERENCES `Loan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FileNotes` ADD CONSTRAINT `FileNotes_loanId_fkey` FOREIGN KEY (`loanId`) REFERENCES `Loan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentChecklist` ADD CONSTRAINT `DocumentChecklist_loanId_fkey` FOREIGN KEY (`loanId`) REFERENCES `Loan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskList` ADD CONSTRAINT `TaskList_loanId_fkey` FOREIGN KEY (`loanId`) REFERENCES `Loan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskUpdates` ADD CONSTRAINT `TaskUpdates_taskListId_fkey` FOREIGN KEY (`taskListId`) REFERENCES `TaskList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
