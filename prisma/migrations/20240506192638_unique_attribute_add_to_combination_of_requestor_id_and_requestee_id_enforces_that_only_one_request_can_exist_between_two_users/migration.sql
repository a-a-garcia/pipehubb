/*
  Warnings:

  - A unique constraint covering the columns `[requestorId,requesteeId]` on the table `LoanTeamRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `LoanTeamRequest_requestorId_requesteeId_key` ON `LoanTeamRequest`(`requestorId`, `requesteeId`);
