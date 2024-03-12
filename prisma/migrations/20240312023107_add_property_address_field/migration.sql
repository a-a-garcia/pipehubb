/*
  Warnings:

  - Added the required column `propertyAddress` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loan` ADD COLUMN `propertyAddress` VARCHAR(255) NOT NULL;
