/*
  Warnings:

  - You are about to drop the column `assignedToUserId` on the `loan` table. All the data in the column will be lost.
  - Added the required column `loanTeamId` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `loan` DROP FOREIGN KEY `Loan_assignedToUserId_fkey`;

-- AlterTable
ALTER TABLE `loan` DROP COLUMN `assignedToUserId`,
    ADD COLUMN `loanTeamId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `LoanTeam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanTeamMember` (
    `id` VARCHAR(191) NOT NULL,
    `loanTeamId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanTeamRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `requestorId` INTEGER NOT NULL,
    `requesteeId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_loanTeamId_fkey` FOREIGN KEY (`loanTeamId`) REFERENCES `LoanTeam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanTeamMember` ADD CONSTRAINT `LoanTeamMember_loanTeamId_fkey` FOREIGN KEY (`loanTeamId`) REFERENCES `LoanTeam`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanTeamMember` ADD CONSTRAINT `LoanTeamMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
