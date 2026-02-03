-- AlterTable
ALTER TABLE "clinic_profiles" ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "facilities" TEXT[],
ADD COLUMN     "licenseExpiry" TIMESTAMP(3),
ADD COLUMN     "licenseNumber" TEXT;

-- AlterTable
ALTER TABLE "practitioner_profiles" ADD COLUMN     "acceptingNewPatients" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "licenseExpiry" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "availabilities" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "slots" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "availabilities_practitionerId_idx" ON "availabilities"("practitionerId");

-- CreateIndex
CREATE INDEX "availabilities_date_idx" ON "availabilities"("date");

-- AddForeignKey
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "practitioner_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
