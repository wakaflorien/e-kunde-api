-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'REVIEWING', 'APPROVED', 'PARTIAL', 'REJECTED', 'CANCELED');

-- CreateTable
CREATE TABLE "insurance_providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurance_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_plans" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverageDetails" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurance_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_insurances" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_insurances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'PENDING',
    "amountClaimed" DOUBLE PRECISION NOT NULL,
    "amountApproved" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'RWF',
    "rejectionReason" TEXT,
    "notes" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "insurance_providers_name_key" ON "insurance_providers"("name");

-- CreateIndex
CREATE INDEX "insurance_plans_providerId_idx" ON "insurance_plans"("providerId");

-- CreateIndex
CREATE INDEX "user_insurances_userId_idx" ON "user_insurances"("userId");

-- CreateIndex
CREATE INDEX "user_insurances_planId_idx" ON "user_insurances"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "user_insurances_userId_planId_key" ON "user_insurances"("userId", "planId");

-- CreateIndex
CREATE UNIQUE INDEX "claims_bookingId_key" ON "claims"("bookingId");

-- CreateIndex
CREATE INDEX "claims_patientId_idx" ON "claims"("patientId");

-- CreateIndex
CREATE INDEX "claims_providerId_idx" ON "claims"("providerId");

-- CreateIndex
CREATE INDEX "claims_status_idx" ON "claims"("status");

-- AddForeignKey
ALTER TABLE "insurance_plans" ADD CONSTRAINT "insurance_plans_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "insurance_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_insurances" ADD CONSTRAINT "user_insurances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_insurances" ADD CONSTRAINT "user_insurances_planId_fkey" FOREIGN KEY ("planId") REFERENCES "insurance_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_planId_fkey" FOREIGN KEY ("planId") REFERENCES "insurance_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "insurance_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
