/*
  Warnings:

  - The `referralSource` column on the `Loan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `borrowerEmail` column on the `Loan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `propertyAddress` column on the `Loan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `borrowerPhone` column on the `Loan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `description` column on the `TaskList` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `borrowerName` on the `Loan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teamName` on the `LoanTeam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `title` on the `TaskList` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "borrowerName";
ALTER TABLE "Loan" ADD COLUMN     "borrowerName" STRING(255) NOT NULL;
ALTER TABLE "Loan" DROP COLUMN "referralSource";
ALTER TABLE "Loan" ADD COLUMN     "referralSource" STRING(255);
ALTER TABLE "Loan" DROP COLUMN "borrowerEmail";
ALTER TABLE "Loan" ADD COLUMN     "borrowerEmail" STRING(255);
ALTER TABLE "Loan" DROP COLUMN "propertyAddress";
ALTER TABLE "Loan" ADD COLUMN     "propertyAddress" STRING(255);
ALTER TABLE "Loan" DROP COLUMN "borrowerPhone";
ALTER TABLE "Loan" ADD COLUMN     "borrowerPhone" STRING(50);

-- AlterTable
ALTER TABLE "LoanTeam" DROP COLUMN "teamName";
ALTER TABLE "LoanTeam" ADD COLUMN     "teamName" STRING(255) NOT NULL;

-- AlterTable
ALTER TABLE "TaskList" DROP COLUMN "title";
ALTER TABLE "TaskList" ADD COLUMN     "title" STRING(255) NOT NULL;
ALTER TABLE "TaskList" DROP COLUMN "description";
ALTER TABLE "TaskList" ADD COLUMN     "description" STRING(2000);

-- CreateIndex
CREATE UNIQUE INDEX "LoanTeam_teamName_key" ON "LoanTeam"("teamName");
