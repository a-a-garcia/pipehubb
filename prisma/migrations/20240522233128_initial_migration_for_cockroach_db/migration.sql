-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PURCHASE', 'REFINANCE');

-- CreateEnum
CREATE TYPE "PipelineStage" AS ENUM ('PROSPECT', 'APPLICATION', 'PROCESSING', 'UNDERWRITING', 'CONDITIONAL', 'CLOSED');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('RECEIVED', 'REQUESTED', 'PENDING');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "LoanTeamRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'CONFIRMED', 'REJECTED');

-- CreateTable
CREATE TABLE "Widget" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "borrowerName" STRING NOT NULL,
    "pipelineStage" "PipelineStage" NOT NULL DEFAULT 'PROSPECT',
    "loanAmount" INT4,
    "transactionType" "TransactionType",
    "referralSource" STRING,
    "borrowerEmail" STRING,
    "propertyAddress" STRING,
    "borrowerPhone" STRING,
    "purchasePrice" INT4,
    "creditScore" INT4,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "loanTeamId" INT8 NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "loanId" INT8 NOT NULL,
    "message" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileNotes" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "loanId" INT8 NOT NULL,
    "userId" STRING NOT NULL,
    "note" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "important" BOOL DEFAULT false,

    CONSTRAINT "FileNotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentChecklist" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "loanId" INT8 NOT NULL,
    "userId" STRING NOT NULL,
    "documentName" STRING NOT NULL,
    "dueDate" TIMESTAMP(3),
    "important" BOOL DEFAULT false,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskList" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "loanId" INT8 NOT NULL,
    "userId" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING,
    "dueDate" TIMESTAMP(3),
    "important" BOOL DEFAULT false,
    "status" "TaskStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskUpdates" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "taskListId" INT8 NOT NULL,
    "important" BOOL DEFAULT false,
    "userId" STRING NOT NULL,
    "message" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskUpdates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" STRING NOT NULL,
    "user_id" STRING NOT NULL,
    "type" STRING NOT NULL,
    "provider" STRING NOT NULL,
    "provider_account_id" STRING NOT NULL,
    "refresh_token" STRING,
    "access_token" STRING,
    "expires_at" INT4,
    "token_type" STRING,
    "scope" STRING,
    "id_token" STRING,
    "session_state" STRING,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" STRING NOT NULL,
    "session_token" STRING NOT NULL,
    "user_id" STRING NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" STRING NOT NULL,
    "name" STRING,
    "email" STRING,
    "email_verified" TIMESTAMP(3),
    "hashedPassword" STRING,
    "image" STRING,
    "firstTimeLogin" BOOL NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" STRING NOT NULL,
    "token" STRING NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "LoanTeam" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "teamName" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanTeamMember" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "loanTeamId" INT8 NOT NULL,
    "userId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanTeamRequest" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "requestorId" STRING NOT NULL,
    "requesteeId" STRING NOT NULL,
    "loanTeamId" INT8 NOT NULL,
    "status" "LoanTeamRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanTeamRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "LoanTeam_teamName_key" ON "LoanTeam"("teamName");

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_loanTeamId_fkey" FOREIGN KEY ("loanTeamId") REFERENCES "LoanTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileNotes" ADD CONSTRAINT "FileNotes_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileNotes" ADD CONSTRAINT "FileNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentChecklist" ADD CONSTRAINT "DocumentChecklist_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentChecklist" ADD CONSTRAINT "DocumentChecklist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskList" ADD CONSTRAINT "TaskList_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskList" ADD CONSTRAINT "TaskList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskUpdates" ADD CONSTRAINT "TaskUpdates_taskListId_fkey" FOREIGN KEY ("taskListId") REFERENCES "TaskList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskUpdates" ADD CONSTRAINT "TaskUpdates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanTeamMember" ADD CONSTRAINT "LoanTeamMember_loanTeamId_fkey" FOREIGN KEY ("loanTeamId") REFERENCES "LoanTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanTeamMember" ADD CONSTRAINT "LoanTeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanTeamRequest" ADD CONSTRAINT "LoanTeamRequest_loanTeamId_fkey" FOREIGN KEY ("loanTeamId") REFERENCES "LoanTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
