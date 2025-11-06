/*
  Warnings:

  - You are about to drop the column `allow_anonymous` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `analytics_enabled` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `close_at` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `custom_domain` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `logo_url` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `max_responses` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `multiple_submissions` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `open_at` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `password_protected` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `require_consent` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `thank_you_screen` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `unique_subdomain` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `forms` table. All the data in the column will be lost.
  - You are about to drop the column `welcome_screen` on the `forms` table. All the data in the column will be lost.
  - The `status` column on the `forms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `forms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `created_at` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `form_id` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `ip_address` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `partial_save` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `referrer_url` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `response_data` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `started_at` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `submitted_at` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `responses` table. All the data in the column will be lost.
  - The `status` column on the `responses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `created_at` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `email_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `forms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `forms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `forms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formId` to the `responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responseData` to the `responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FormType" AS ENUM ('REACH_OUT', 'EMBEDDED');

-- CreateEnum
CREATE TYPE "ResponseStatus" AS ENUM ('STARTED', 'COMPLETED', 'ABANDONED', 'PARTIAL');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEBIT', 'TRANSFER', 'RESPONSE', 'REFUND', 'AI_USAGE');

-- DropForeignKey
ALTER TABLE "public"."forms" DROP CONSTRAINT "forms_project_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."forms" DROP CONSTRAINT "forms_team_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_team_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."responses" DROP CONSTRAINT "responses_form_id_fkey";

-- AlterTable
ALTER TABLE "forms" DROP COLUMN "allow_anonymous",
DROP COLUMN "analytics_enabled",
DROP COLUMN "close_at",
DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "custom_domain",
DROP COLUMN "logo_url",
DROP COLUMN "max_responses",
DROP COLUMN "multiple_submissions",
DROP COLUMN "open_at",
DROP COLUMN "password_hash",
DROP COLUMN "password_protected",
DROP COLUMN "project_id",
DROP COLUMN "require_consent",
DROP COLUMN "team_id",
DROP COLUMN "thank_you_screen",
DROP COLUMN "unique_subdomain",
DROP COLUMN "updated_at",
DROP COLUMN "welcome_screen",
ADD COLUMN     "allowAnonymous" BOOLEAN,
ADD COLUMN     "analyticsEnabled" BOOLEAN,
ADD COLUMN     "closeAt" TIMESTAMPTZ,
ADD COLUMN     "createdAt" TIMESTAMPTZ,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "customDomain" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "maxResponses" INTEGER,
ADD COLUMN     "multipleSubmissions" BOOLEAN,
ADD COLUMN     "openAt" TIMESTAMPTZ,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "passwordProtected" BOOLEAN,
ADD COLUMN     "projectId" UUID NOT NULL,
ADD COLUMN     "requireConsent" BOOLEAN,
ADD COLUMN     "teamId" UUID NOT NULL,
ADD COLUMN     "thankYouScreen" JSONB,
ADD COLUMN     "uniqueSubdomain" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMPTZ,
ADD COLUMN     "valid" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "welcomeScreen" JSONB,
DROP COLUMN "status",
ADD COLUMN     "status" "FormStatus",
DROP COLUMN "type",
ADD COLUMN     "type" "FormType";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "created_at",
DROP COLUMN "team_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMPTZ,
ADD COLUMN     "teamId" UUID NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ,
ADD COLUMN     "valid" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "responses" DROP COLUMN "form_id",
DROP COLUMN "ip_address",
DROP COLUMN "partial_save",
DROP COLUMN "referrer_url",
DROP COLUMN "response_data",
DROP COLUMN "started_at",
DROP COLUMN "submitted_at",
DROP COLUMN "updated_at",
DROP COLUMN "user_agent",
DROP COLUMN "user_id",
ADD COLUMN     "formId" UUID NOT NULL,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "partialSave" BOOLEAN,
ADD COLUMN     "referrerUrl" TEXT,
ADD COLUMN     "responseData" JSONB NOT NULL,
ADD COLUMN     "startedAt" TIMESTAMPTZ,
ADD COLUMN     "submittedAt" TIMESTAMPTZ,
ADD COLUMN     "updatedAt" TIMESTAMPTZ,
ADD COLUMN     "userAgent" TEXT,
ADD COLUMN     "userId" TEXT,
ADD COLUMN     "valid" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "status",
ADD COLUMN     "status" "ResponseStatus";

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "created_at",
DROP COLUMN "owner_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ownerId" VARCHAR,
ADD COLUMN     "updatedAt" TIMESTAMP,
ADD COLUMN     "valid" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "email_verified",
DROP COLUMN "last_name",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL;

-- DropEnum
DROP TYPE "public"."form_status";

-- DropEnum
DROP TYPE "public"."form_type";

-- DropEnum
DROP TYPE "public"."response_status";

-- CreateTable
CREATE TABLE "wallets" (
    "id" VARCHAR(30) NOT NULL,
    "teamId" UUID NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "currencyRate" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" VARCHAR(30) NOT NULL,
    "walletId" VARCHAR(30) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR,

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

-- CreateIndex
CREATE UNIQUE INDEX "wallets_teamId_key" ON "wallets"("teamId");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "features_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_formId_fkey" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
