-- CreateEnum
CREATE TYPE "AvailabilityExceptionType" AS ENUM ('BLOCKED_DAY', 'SPECIAL_HOURS');

-- AlterTable
ALTER TABLE "AdvisoryBooking" ADD COLUMN     "calendarSyncError" TEXT,
ADD COLUMN     "calendarSyncStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "companyEmailStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "customerEmailStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "AvailabilitySettings" (
    "id" UUID NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "timezone" VARCHAR(80) NOT NULL DEFAULT 'America/Bogota',
    "timezoneLabel" VARCHAR(80) NOT NULL DEFAULT 'America/Bogota',
    "durationMinutes" INTEGER NOT NULL DEFAULT 45,
    "bufferMinutes" INTEGER NOT NULL DEFAULT 15,
    "minNoticeHours" INTEGER NOT NULL DEFAULT 12,
    "maxDaysAhead" INTEGER NOT NULL DEFAULT 30,
    "defaultModality" VARCHAR(80) NOT NULL DEFAULT 'Virtual',
    "calendarMockMode" VARCHAR(40) NOT NULL DEFAULT 'none',
    "updatedByAdminId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailabilitySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilityRule" (
    "id" UUID NOT NULL,
    "settingsId" UUID NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startTime" VARCHAR(5) NOT NULL,
    "endTime" VARCHAR(5) NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailabilityRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilityException" (
    "id" UUID NOT NULL,
    "settingsId" UUID NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "type" "AvailabilityExceptionType" NOT NULL,
    "reason" VARCHAR(180),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailabilityException_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailabilityExceptionRange" (
    "id" UUID NOT NULL,
    "exceptionId" UUID NOT NULL,
    "startTime" VARCHAR(5) NOT NULL,
    "endTime" VARCHAR(5) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailabilityExceptionRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedPeriod" (
    "id" UUID NOT NULL,
    "settingsId" UUID NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "startTime" VARCHAR(5) NOT NULL,
    "endTime" VARCHAR(5) NOT NULL,
    "reason" VARCHAR(180),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockedPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarIntegration" (
    "id" UUID NOT NULL,
    "provider" VARCHAR(80) NOT NULL DEFAULT 'google_calendar',
    "mode" VARCHAR(40) NOT NULL DEFAULT 'mock',
    "calendarId" VARCHAR(191),
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "syncStatus" "DeliveryStatus" NOT NULL DEFAULT 'SKIPPED',
    "lastSyncError" TEXT,
    "lastCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AvailabilitySettings_isEnabled_updatedAt_idx" ON "AvailabilitySettings"("isEnabled", "updatedAt");

-- CreateIndex
CREATE INDEX "AvailabilityRule_settingsId_weekday_isEnabled_idx" ON "AvailabilityRule"("settingsId", "weekday", "isEnabled");

-- CreateIndex
CREATE INDEX "AvailabilityException_settingsId_date_type_idx" ON "AvailabilityException"("settingsId", "date", "type");

-- CreateIndex
CREATE INDEX "AvailabilityExceptionRange_exceptionId_sortOrder_idx" ON "AvailabilityExceptionRange"("exceptionId", "sortOrder");

-- CreateIndex
CREATE INDEX "BlockedPeriod_settingsId_date_idx" ON "BlockedPeriod"("settingsId", "date");

-- CreateIndex
CREATE INDEX "CalendarIntegration_provider_mode_isEnabled_idx" ON "CalendarIntegration"("provider", "mode", "isEnabled");

-- AddForeignKey
ALTER TABLE "AvailabilitySettings" ADD CONSTRAINT "AvailabilitySettings_updatedByAdminId_fkey" FOREIGN KEY ("updatedByAdminId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityRule" ADD CONSTRAINT "AvailabilityRule_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "AvailabilitySettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityException" ADD CONSTRAINT "AvailabilityException_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "AvailabilitySettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailabilityExceptionRange" ADD CONSTRAINT "AvailabilityExceptionRange_exceptionId_fkey" FOREIGN KEY ("exceptionId") REFERENCES "AvailabilityException"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedPeriod" ADD CONSTRAINT "BlockedPeriod_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "AvailabilitySettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
