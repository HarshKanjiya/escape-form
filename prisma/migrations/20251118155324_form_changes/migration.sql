-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FormType" AS ENUM ('REACH_OUT', 'EMBEDDED');

-- CreateEnum
CREATE TYPE "ResponseStatus" AS ENUM ('STARTED', 'COMPLETED', 'ABANDONED', 'PARTIAL');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEBIT', 'TRANSFER', 'RESPONSE', 'REFUND', 'AI_USAGE', 'GIFT');

-- CreateEnum
CREATE TYPE "AnalyticsEventType" AS ENUM ('FORM_OPENED', 'FORM_STARTED', 'FORM_SUBMITTED');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('USER_DETAIL', 'USER_ADDRESS', 'TEXT_SHORT', 'TEXT_LONG', 'FILE_ANY', 'FILE_IMAGE_OR_VIDEO', 'CHOICE_SINGLE', 'CHOICE_MULTIPLE', 'CHOICE_PICTURE', 'CHOICE_CHECKBOX', 'CHOICE_BOOL', 'CHOICE_DROPDOWN', 'INFO_EMAIL', 'INFO_PHONE', 'INFO_URL', 'SCREEN_WELCOME', 'SCREEN_END', 'SCREEN_STATEMENT', 'RATING_ZERO_TO_TEN', 'RATING_STAR', 'RATING_RANK', 'LEAGAL', 'REDIRECT_TO_URL', 'NUMBER', 'DATE');

-- CreateEnum
CREATE TYPE "CouponDiscountType" AS ENUM ('FLAT', 'PERCENT');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('GENERAL', 'PLAN_BASED');

-- CreateTable
CREATE TABLE "teams" (
    "id" UUID NOT NULL,
    "name" VARCHAR,
    "ownerId" VARCHAR,
    "planId" UUID,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "teamId" UUID NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forms" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "teamId" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "theme" TEXT,
    "logoUrl" TEXT,
    "maxResponses" INTEGER,
    "openAt" TIMESTAMPTZ,
    "closeAt" TIMESTAMPTZ,
    "type" "FormType",
    "status" "FormStatus",
    "uniqueSubdomain" TEXT,
    "customDomain" TEXT,
    "requireConsent" BOOLEAN,
    "allowAnonymous" BOOLEAN,
    "multipleSubmissions" BOOLEAN DEFAULT false,
    "passwordProtected" BOOLEAN DEFAULT false,
    "analyticsEnabled" BOOLEAN DEFAULT true,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

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
    "questionId" UUID NOT NULL,
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
    "sourceNodeId" UUID NOT NULL,
    "targetNodeId" UUID NOT NULL,
    "condition" JSONB DEFAULT '{}',

    CONSTRAINT "edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responses" (
    "id" UUID NOT NULL,
    "formId" UUID NOT NULL,
    "userId" TEXT,
    "data" JSONB NOT NULL DEFAULT '{}',
    "metaData" JSONB DEFAULT '{}',
    "tags" TEXT[],
    "status" "ResponseStatus",
    "partialSave" BOOLEAN,
    "notified" BOOLEAN,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "startedAt" TIMESTAMPTZ,
    "submittedAt" TIMESTAMPTZ,
    "updatedAt" TIMESTAMPTZ,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" UUID NOT NULL,
    "formId" UUID NOT NULL,
    "eventType" "AnalyticsEventType",
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR,
    "teamId" UUID NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" UUID NOT NULL,
    "type" "CouponType" NOT NULL DEFAULT 'GENERAL',
    "discountType" "CouponDiscountType" NOT NULL DEFAULT 'FLAT',
    "planId" UUID,
    "amount" DOUBLE PRECISION,
    "useLeft" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "googleId" TEXT,
    "profilePicture" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "teams_ownerId_idx" ON "teams"("ownerId");

-- CreateIndex
CREATE INDEX "projects_teamId_idx" ON "projects"("teamId");

-- CreateIndex
CREATE INDEX "forms_projectId_idx" ON "forms"("projectId");

-- CreateIndex
CREATE INDEX "forms_teamId_idx" ON "forms"("teamId");

-- CreateIndex
CREATE INDEX "active_passwords_formId_idx" ON "active_passwords"("formId");

-- CreateIndex
CREATE INDEX "QuestionOption_questionId_idx" ON "QuestionOption"("questionId");

-- CreateIndex
CREATE INDEX "questions_formId_idx" ON "questions"("formId");

-- CreateIndex
CREATE INDEX "edges_formId_idx" ON "edges"("formId");

-- CreateIndex
CREATE INDEX "responses_formId_idx" ON "responses"("formId");

-- CreateIndex
CREATE INDEX "analytics_events_formId_idx" ON "analytics_events"("formId");

-- CreateIndex
CREATE INDEX "transactions_teamId_idx" ON "transactions"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "active_passwords" ADD CONSTRAINT "active_passwords_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "features_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
