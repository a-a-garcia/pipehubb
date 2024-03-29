/*
  Warnings:

  - Added the required column `dueDate` to the `DocumentChecklist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `documentchecklist` ADD COLUMN `dueDate` DATETIME(3) NOT NULL;
