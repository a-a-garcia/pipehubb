/*
  Warnings:

  - Added the required column `loanTeamId` to the `LoanTeamRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loanteamrequest` ADD COLUMN `loanTeamId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `LoanTeamRequest` ADD CONSTRAINT `LoanTeamRequest_loanTeamId_fkey` FOREIGN KEY (`loanTeamId`) REFERENCES `LoanTeam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
