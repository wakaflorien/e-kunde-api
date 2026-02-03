/*
  Warnings:

  - You are about to drop the column `answers` on the `matching_tests` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `matching_tests` table. All the data in the column will be lost.
  - You are about to drop the column `recommendations` on the `matching_tests` table. All the data in the column will be lost.
  - You are about to drop the column `results` on the `matching_tests` table. All the data in the column will be lost.
  - You are about to drop the column `fromPractitionerId` on the `referrals` table. All the data in the column will be lost.
  - You are about to drop the column `toPractitionerId` on the `referrals` table. All the data in the column will be lost.
  - Added the required column `inputData` to the `matching_tests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referrerId` to the `referrals` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."matching_tests_userId_idx";

-- DropIndex
DROP INDEX "public"."referrals_fromPractitionerId_idx";

-- DropIndex
DROP INDEX "public"."referrals_toPractitionerId_idx";

-- AlterTable
ALTER TABLE "matching_tests" DROP COLUMN "answers",
DROP COLUMN "completedAt",
DROP COLUMN "recommendations",
DROP COLUMN "results",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "inputData" JSONB NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'COMPLETED',
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "referrals" DROP COLUMN "fromPractitionerId",
DROP COLUMN "toPractitionerId",
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'ROUTINE',
ADD COLUMN     "referrerId" TEXT NOT NULL,
ADD COLUMN     "targetId" TEXT,
ADD COLUMN     "targetSpecialty" TEXT,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "matching_results" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matching_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "matching_results_testId_idx" ON "matching_results"("testId");

-- CreateIndex
CREATE INDEX "referrals_referrerId_idx" ON "referrals"("referrerId");

-- CreateIndex
CREATE INDEX "referrals_status_idx" ON "referrals"("status");

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matching_results" ADD CONSTRAINT "matching_results_testId_fkey" FOREIGN KEY ("testId") REFERENCES "matching_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
