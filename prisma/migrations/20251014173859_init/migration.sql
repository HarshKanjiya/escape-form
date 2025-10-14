/*
  Warnings:

  - The `type` column on the `forms` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "form_type" AS ENUM ('REACH_OUT', 'EMBEDDED');

-- AlterTable
ALTER TABLE "forms" DROP COLUMN "type",
ADD COLUMN     "type" "form_type";
