/*
  Warnings:

  - Made the column `type` on table `forms` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "FormPageType" AS ENUM ('SINGLE', 'STEPPER');

-- AlterTable
ALTER TABLE "forms" ADD COLUMN     "formPageType" "FormPageType" NOT NULL DEFAULT 'STEPPER',
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'REACH_OUT';
