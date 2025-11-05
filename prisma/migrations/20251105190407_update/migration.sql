/*
  Warnings:

  - The `config` column on the `forms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `google_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `team_id` to the `forms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."users_google_id_key";

-- AlterTable
ALTER TABLE "forms" ADD COLUMN     "team_id" UUID NOT NULL,
DROP COLUMN "config",
ADD COLUMN     "config" JSONB[];

-- AlterTable
ALTER TABLE "users" DROP COLUMN "first_name",
DROP COLUMN "google_id",
DROP COLUMN "phone_number",
DROP COLUMN "profile_picture",
DROP COLUMN "user_name",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "userName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
