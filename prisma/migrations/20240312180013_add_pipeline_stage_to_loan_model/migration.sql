-- AlterTable
ALTER TABLE `loan` ADD COLUMN `pipelineStage` ENUM('PROSPECT', 'APPLICATION', 'PROCESSING', 'UNDERWRITING', 'CONDITIONAL', 'CLOSED') NOT NULL DEFAULT 'PROSPECT';
