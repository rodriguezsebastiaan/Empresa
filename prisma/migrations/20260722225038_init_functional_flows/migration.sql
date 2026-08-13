-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('OWNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "ContactSubmissionStatus" AS ENUM ('NEW', 'IN_REVIEW', 'CONTACTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "DiagnosticSubmissionStatus" AS ENUM ('NEW', 'IN_ANALYSIS', 'CONTACTED', 'PROPOSAL_SENT', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "AdvisoryBookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" UUID NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "emailNormalized" VARCHAR(191) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" UUID NOT NULL,
    "adminUserId" UUID NOT NULL,
    "tokenHash" VARCHAR(128) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3),
    "userAgent" VARCHAR(500),
    "ipHash" VARCHAR(128),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" UUID NOT NULL,
    "status" "ContactSubmissionStatus" NOT NULL DEFAULT 'NEW',
    "name" VARCHAR(80) NOT NULL,
    "company" VARCHAR(120) NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "emailNormalized" VARCHAR(191) NOT NULL,
    "phone" VARCHAR(25) NOT NULL,
    "subject" VARCHAR(120) NOT NULL,
    "message" TEXT NOT NULL,
    "privacyAcceptedAt" TIMESTAMP(3) NOT NULL,
    "privacyPolicyVersion" VARCHAR(120) NOT NULL,
    "internalEmailStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "clientEmailStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "lastDeliveryError" TEXT,
    "lastDeliveryAttemptAt" TIMESTAMP(3),
    "requestOrigin" VARCHAR(191),
    "requestPath" VARCHAR(191),
    "referer" VARCHAR(191),
    "userAgent" VARCHAR(500),
    "ipHash" VARCHAR(128),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticSubmission" (
    "id" UUID NOT NULL,
    "status" "DiagnosticSubmissionStatus" NOT NULL DEFAULT 'NEW',
    "name" VARCHAR(80) NOT NULL,
    "company" VARCHAR(120) NOT NULL,
    "role" VARCHAR(80) NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "emailNormalized" VARCHAR(191) NOT NULL,
    "phone" VARCHAR(25) NOT NULL,
    "city" VARCHAR(80) NOT NULL,
    "sector" VARCHAR(80) NOT NULL,
    "teamSize" VARCHAR(50) NOT NULL,
    "processes" TEXT NOT NULL,
    "currentProcess" TEXT NOT NULL,
    "tools" TEXT NOT NULL,
    "repetitiveTasks" TEXT NOT NULL,
    "mainProblem" TEXT NOT NULL,
    "expectedResult" TEXT NOT NULL,
    "contactPreference" VARCHAR(40) NOT NULL,
    "wantsMeeting" BOOLEAN NOT NULL,
    "summary" TEXT NOT NULL,
    "privacyAcceptedAt" TIMESTAMP(3) NOT NULL,
    "privacyPolicyVersion" VARCHAR(120) NOT NULL,
    "internalEmailStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "clientEmailStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "webhookStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "lastDeliveryError" TEXT,
    "lastDeliveryAttemptAt" TIMESTAMP(3),
    "requestOrigin" VARCHAR(191),
    "requestPath" VARCHAR(191),
    "referer" VARCHAR(191),
    "userAgent" VARCHAR(500),
    "ipHash" VARCHAR(128),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiagnosticSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvisoryBooking" (
    "id" UUID NOT NULL,
    "requestId" VARCHAR(120) NOT NULL,
    "slotKey" VARCHAR(120),
    "status" "AdvisoryBookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "fullName" VARCHAR(90) NOT NULL,
    "company" VARCHAR(120) NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "emailNormalized" VARCHAR(191) NOT NULL,
    "phone" VARCHAR(25) NOT NULL,
    "city" VARCHAR(80) NOT NULL,
    "processGoal" TEXT NOT NULL,
    "modality" VARCHAR(60) NOT NULL,
    "timezone" VARCHAR(80) NOT NULL,
    "scheduledDate" VARCHAR(10) NOT NULL,
    "scheduledTime" VARCHAR(5) NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "privacyAcceptedAt" TIMESTAMP(3) NOT NULL,
    "privacyPolicyVersion" VARCHAR(120) NOT NULL,
    "googleCalendarEventId" VARCHAR(191),
    "googleCalendarHtmlLink" TEXT,
    "googleMeetUrl" TEXT,
    "calendarEventStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "internalEmailStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "clientEmailStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "lastDeliveryError" TEXT,
    "lastDeliveryAttemptAt" TIMESTAMP(3),
    "requestOrigin" VARCHAR(191),
    "requestPath" VARCHAR(191),
    "referer" VARCHAR(191),
    "userAgent" VARCHAR(500),
    "ipHash" VARCHAR(128),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdvisoryBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminNote" (
    "id" UUID NOT NULL,
    "adminUserId" UUID NOT NULL,
    "contactSubmissionId" UUID,
    "diagnosticSubmissionId" UUID,
    "advisoryBookingId" UUID,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusHistory" (
    "id" UUID NOT NULL,
    "adminUserId" UUID,
    "contactSubmissionId" UUID,
    "diagnosticSubmissionId" UUID,
    "advisoryBookingId" UUID,
    "fromStatus" VARCHAR(40),
    "toStatus" VARCHAR(40) NOT NULL,
    "note" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_emailNormalized_key" ON "AdminUser"("emailNormalized");

-- CreateIndex
CREATE INDEX "AdminUser_isActive_createdAt_idx" ON "AdminUser"("isActive", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_tokenHash_key" ON "AdminSession"("tokenHash");

-- CreateIndex
CREATE INDEX "AdminSession_adminUserId_expiresAt_idx" ON "AdminSession"("adminUserId", "expiresAt");

-- CreateIndex
CREATE INDEX "ContactSubmission_status_createdAt_idx" ON "ContactSubmission"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContactSubmission_emailNormalized_createdAt_idx" ON "ContactSubmission"("emailNormalized", "createdAt");

-- CreateIndex
CREATE INDEX "ContactSubmission_company_createdAt_idx" ON "ContactSubmission"("company", "createdAt");

-- CreateIndex
CREATE INDEX "DiagnosticSubmission_status_createdAt_idx" ON "DiagnosticSubmission"("status", "createdAt");

-- CreateIndex
CREATE INDEX "DiagnosticSubmission_emailNormalized_createdAt_idx" ON "DiagnosticSubmission"("emailNormalized", "createdAt");

-- CreateIndex
CREATE INDEX "DiagnosticSubmission_company_createdAt_idx" ON "DiagnosticSubmission"("company", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdvisoryBooking_requestId_key" ON "AdvisoryBooking"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "AdvisoryBooking_slotKey_key" ON "AdvisoryBooking"("slotKey");

-- CreateIndex
CREATE UNIQUE INDEX "AdvisoryBooking_googleCalendarEventId_key" ON "AdvisoryBooking"("googleCalendarEventId");

-- CreateIndex
CREATE INDEX "AdvisoryBooking_status_startAt_idx" ON "AdvisoryBooking"("status", "startAt");

-- CreateIndex
CREATE INDEX "AdvisoryBooking_emailNormalized_createdAt_idx" ON "AdvisoryBooking"("emailNormalized", "createdAt");

-- CreateIndex
CREATE INDEX "AdvisoryBooking_scheduledDate_status_idx" ON "AdvisoryBooking"("scheduledDate", "status");

-- CreateIndex
CREATE INDEX "AdminNote_adminUserId_createdAt_idx" ON "AdminNote"("adminUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AdminNote_contactSubmissionId_createdAt_idx" ON "AdminNote"("contactSubmissionId", "createdAt");

-- CreateIndex
CREATE INDEX "AdminNote_diagnosticSubmissionId_createdAt_idx" ON "AdminNote"("diagnosticSubmissionId", "createdAt");

-- CreateIndex
CREATE INDEX "AdminNote_advisoryBookingId_createdAt_idx" ON "AdminNote"("advisoryBookingId", "createdAt");

-- CreateIndex
CREATE INDEX "StatusHistory_adminUserId_createdAt_idx" ON "StatusHistory"("adminUserId", "createdAt");

-- CreateIndex
CREATE INDEX "StatusHistory_contactSubmissionId_createdAt_idx" ON "StatusHistory"("contactSubmissionId", "createdAt");

-- CreateIndex
CREATE INDEX "StatusHistory_diagnosticSubmissionId_createdAt_idx" ON "StatusHistory"("diagnosticSubmissionId", "createdAt");

-- CreateIndex
CREATE INDEX "StatusHistory_advisoryBookingId_createdAt_idx" ON "StatusHistory"("advisoryBookingId", "createdAt");

-- AddForeignKey
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_contactSubmissionId_fkey" FOREIGN KEY ("contactSubmissionId") REFERENCES "ContactSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_diagnosticSubmissionId_fkey" FOREIGN KEY ("diagnosticSubmissionId") REFERENCES "DiagnosticSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_advisoryBookingId_fkey" FOREIGN KEY ("advisoryBookingId") REFERENCES "AdvisoryBooking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_contactSubmissionId_fkey" FOREIGN KEY ("contactSubmissionId") REFERENCES "ContactSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_diagnosticSubmissionId_fkey" FOREIGN KEY ("diagnosticSubmissionId") REFERENCES "DiagnosticSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_advisoryBookingId_fkey" FOREIGN KEY ("advisoryBookingId") REFERENCES "AdvisoryBooking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
