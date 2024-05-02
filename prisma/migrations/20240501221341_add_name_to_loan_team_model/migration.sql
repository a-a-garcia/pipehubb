/*
  Warnings:

  - Added the required column `teamName` to the `LoanTeam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loanteam` ADD COLUMN `teamName` VARCHAR(255) NOT NULL;
