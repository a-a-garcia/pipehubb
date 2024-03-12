-- CreateTable
CREATE TABLE `Loan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `borrowerName` VARCHAR(255) NOT NULL,
    `borrowerEmail` VARCHAR(255) NOT NULL,
    `loan_amount` INTEGER NOT NULL,
    `transactionType` ENUM('PURCHASE', 'REFINANCE') NOT NULL,
    `borrowerPhone` INTEGER NULL,
    `purchasePrice` INTEGER NULL,
    `creditScore` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
