/*
  Warnings:

  - You are about to drop the column `config` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `thankYouScreen` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeScreen` on the `forms` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('USER_DETAIL', 'USER_ADDRESS', 'TEXT_SHORT', 'TEXT_LONG', 'FILE_ANY', 'FILE_IMAGE_OR_VIDEO', 'CHOICE_SINGLE', 'CHOICE_MULTIPLE', 'CHOICE_PICTURE', 'CHOICE_CHECKBOX', 'CHOICE_BOOL', 'CHOICE_DROPDOWN', 'INFO_EMAIL', 'INFO_PHONE', 'INFO_URL', 'SCREEN_WELCOME', 'SCREEN_END', 'SCREEN_STATEMENT', 'RATING_ZERO_TO_TEN', 'RATING_STAR', 'RATING_RANK', 'LEAGAL', 'REDIRECT_TO_URL', 'NUMBER', 'DATE');

-- AlterTable
ALTER TABLE "forms" DROP COLUMN "config",
DROP COLUMN "passwordHash",
DROP COLUMN "thankYouScreen",
DROP COLUMN "welcomeScreen";

-- CreateTable
CREATE TABLE "active_passwords" (
    "id" UUID NOT NULL,
    "formId" UUID NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "expireAt" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questionId" UUID,

    CONSTRAINT "active_passwords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" UUID NOT NULL,
    "questionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" UUID NOT NULL,
    "formId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "placeholder" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "required" BOOLEAN NOT NULL DEFAULT false,
    "type" "QuestionType" NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edges" (
    "id" UUID NOT NULL,
    "formId" UUID NOT NULL,
    "fromQueId" UUID NOT NULL,
    "toQueId" UUID NOT NULL,
    "sourceNodeId" TEXT NOT NULL,
    "targetNodeId" TEXT NOT NULL,
    "condition" JSONB DEFAULT '{}',

    CONSTRAINT "edges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "active_passwords_formId_idx" ON "active_passwords"("formId");

-- CreateIndex
CREATE INDEX "QuestionOption_questionId_idx" ON "QuestionOption"("questionId");

-- CreateIndex
CREATE INDEX "questions_formId_idx" ON "questions"("formId");

-- CreateIndex
CREATE INDEX "edges_formId_idx" ON "edges"("formId");

-- CreateIndex
CREATE INDEX "analytics_events_formId_idx" ON "analytics_events"("formId");

-- CreateIndex
CREATE INDEX "forms_projectId_idx" ON "forms"("projectId");

-- CreateIndex
CREATE INDEX "forms_teamId_idx" ON "forms"("teamId");

-- CreateIndex
CREATE INDEX "projects_teamId_idx" ON "projects"("teamId");

-- CreateIndex
CREATE INDEX "responses_formId_idx" ON "responses"("formId");

-- CreateIndex
CREATE INDEX "teams_ownerId_idx" ON "teams"("ownerId");

-- CreateIndex
CREATE INDEX "transactions_teamId_idx" ON "transactions"("teamId");

-- AddForeignKey
ALTER TABLE "active_passwords" ADD CONSTRAINT "active_passwords_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "active_passwords" ADD CONSTRAINT "active_passwords_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edges" ADD CONSTRAINT "edges_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edges" ADD CONSTRAINT "edges_sourceNodeId_fkey" FOREIGN KEY ("sourceNodeId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edges" ADD CONSTRAINT "edges_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
