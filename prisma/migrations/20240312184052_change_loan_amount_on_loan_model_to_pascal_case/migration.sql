/*
  Warnings:

  - You are about to drop the column `loan_amount` on the `loan` table. All the data in the column will be lost.
  - Added the required column `loanAmount` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loan` DROP COLUMN `loan_amount`,
    ADD COLUMN `loanAmount` INTEGER NOT NULL;
