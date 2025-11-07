-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'GIFT';

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "planId" UUID;

-- AlterTable
ALTER TABLE "wallets" ADD COLUMN     "nonTransferableBalance" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
