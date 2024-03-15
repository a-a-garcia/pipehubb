-- AlterTable
ALTER TABLE `loan` ADD COLUMN `referralSource` VARCHAR(255) NULL,
    MODIFY `transactionType` ENUM('PURCHASE', 'REFINANCE') NULL,
    MODIFY `loanAmount` INTEGER NULL;
