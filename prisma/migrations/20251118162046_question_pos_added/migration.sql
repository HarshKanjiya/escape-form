/*
  Warnings:

  - Added the required column `posX` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `posY` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "posX" INTEGER NOT NULL,
ADD COLUMN     "posY" INTEGER NOT NULL;
