/*
  Warnings:

  - A unique constraint covering the columns `[teamName]` on the table `LoanTeam` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `LoanTeam_teamName_key` ON `LoanTeam`(`teamName`);
