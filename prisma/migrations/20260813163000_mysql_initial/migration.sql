-- CreateTable
CREATE TABLE `AdminUser` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailNormalized` VARCHAR(191) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `passwordHash` TEXT NOT NULL,
    `role` ENUM('OWNER', 'ADMIN') NOT NULL DEFAULT 'ADMIN',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `failedLoginCount` INTEGER NOT NULL DEFAULT 0,
    `lockedUntil` DATETIME(3) NULL,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdminUser_emailNormalized_key`(`emailNormalized`),
    INDEX `AdminUser_isActive_createdAt_idx`(`isActive`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminSession` (
    `id` CHAR(36) NOT NULL,
    `adminUserId` CHAR(36) NOT NULL,
    `tokenHash` VARCHAR(128) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `lastSeenAt` DATETIME(3) NULL,
    `userAgent` VARCHAR(500) NULL,
    `ipHash` VARCHAR(128) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdminSession_tokenHash_key`(`tokenHash`),
    INDEX `AdminSession_adminUserId_expiresAt_idx`(`adminUserId`, `expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminPermission` (
    `id` CHAR(36) NOT NULL,
    `key` VARCHAR(120) NOT NULL,
    `description` VARCHAR(240) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdminPermission_key_key`(`key`),
    INDEX `AdminPermission_key_idx`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminRolePermission` (
    `id` CHAR(36) NOT NULL,
    `role` ENUM('OWNER', 'ADMIN') NOT NULL,
    `permissionId` CHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AdminRolePermission_permissionId_idx`(`permissionId`),
    UNIQUE INDEX `AdminRolePermission_role_permissionId_key`(`role`, `permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminLoginAttempt` (
    `id` CHAR(36) NOT NULL,
    `adminUserId` CHAR(36) NULL,
    `emailNormalized` VARCHAR(191) NOT NULL,
    `success` BOOLEAN NOT NULL DEFAULT false,
    `failureReason` VARCHAR(80) NULL,
    `ipHash` VARCHAR(128) NULL,
    `userAgent` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AdminLoginAttempt_emailNormalized_createdAt_idx`(`emailNormalized`, `createdAt`),
    INDEX `AdminLoginAttempt_adminUserId_createdAt_idx`(`adminUserId`, `createdAt`),
    INDEX `AdminLoginAttempt_success_createdAt_idx`(`success`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminAuditLog` (
    `id` CHAR(36) NOT NULL,
    `adminUserId` CHAR(36) NULL,
    `action` VARCHAR(120) NOT NULL,
    `entityType` VARCHAR(80) NOT NULL,
    `entityId` VARCHAR(120) NULL,
    `metadata` JSON NULL,
    `ipHash` VARCHAR(128) NULL,
    `userAgent` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AdminAuditLog_adminUserId_createdAt_idx`(`adminUserId`, `createdAt`),
    INDEX `AdminAuditLog_entityType_entityId_idx`(`entityType`, `entityId`),
    INDEX `AdminAuditLog_action_createdAt_idx`(`action`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminNotification` (
    `id` CHAR(36) NOT NULL,
    `recipientAdminUserId` CHAR(36) NULL,
    `recipientRole` ENUM('OWNER', 'ADMIN') NULL,
    `type` VARCHAR(80) NOT NULL,
    `title` VARCHAR(160) NOT NULL,
    `description` VARCHAR(500) NULL,
    `entityType` VARCHAR(80) NULL,
    `entityId` VARCHAR(120) NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AdminNotification_recipientAdminUserId_isRead_createdAt_idx`(`recipientAdminUserId`, `isRead`, `createdAt`),
    INDEX `AdminNotification_recipientRole_isRead_createdAt_idx`(`recipientRole`, `isRead`, `createdAt`),
    INDEX `AdminNotification_entityType_entityId_idx`(`entityType`, `entityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactSubmission` (
    `id` CHAR(36) NOT NULL,
    `status` ENUM('NEW', 'IN_REVIEW', 'CONTACTED', 'CLOSED') NOT NULL DEFAULT 'NEW',
    `name` VARCHAR(80) NOT NULL,
    `company` VARCHAR(120) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailNormalized` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(25) NOT NULL,
    `subject` VARCHAR(120) NOT NULL,
    `message` TEXT NOT NULL,
    `privacyAcceptedAt` DATETIME(3) NOT NULL,
    `privacyPolicyVersion` VARCHAR(120) NOT NULL,
    `internalEmailStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `clientEmailStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `lastDeliveryError` TEXT NULL,
    `lastDeliveryAttemptAt` DATETIME(3) NULL,
    `requestOrigin` VARCHAR(191) NULL,
    `requestPath` VARCHAR(191) NULL,
    `referer` VARCHAR(191) NULL,
    `userAgent` VARCHAR(500) NULL,
    `ipHash` VARCHAR(128) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ContactSubmission_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `ContactSubmission_emailNormalized_createdAt_idx`(`emailNormalized`, `createdAt`),
    INDEX `ContactSubmission_company_createdAt_idx`(`company`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiagnosticSubmission` (
    `id` CHAR(36) NOT NULL,
    `status` ENUM('NEW', 'IN_ANALYSIS', 'CONTACTED', 'PROPOSAL_SENT', 'WON', 'LOST') NOT NULL DEFAULT 'NEW',
    `name` VARCHAR(80) NOT NULL,
    `company` VARCHAR(120) NOT NULL,
    `role` VARCHAR(80) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailNormalized` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(25) NOT NULL,
    `city` VARCHAR(80) NOT NULL,
    `sector` VARCHAR(80) NOT NULL,
    `teamSize` VARCHAR(50) NOT NULL,
    `processes` TEXT NOT NULL,
    `currentProcess` TEXT NOT NULL,
    `tools` TEXT NOT NULL,
    `repetitiveTasks` TEXT NOT NULL,
    `mainProblem` TEXT NOT NULL,
    `expectedResult` TEXT NOT NULL,
    `contactPreference` VARCHAR(40) NOT NULL,
    `wantsMeeting` BOOLEAN NOT NULL,
    `summary` TEXT NOT NULL,
    `privacyAcceptedAt` DATETIME(3) NOT NULL,
    `privacyPolicyVersion` VARCHAR(120) NOT NULL,
    `internalEmailStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `clientEmailStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `webhookStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `lastDeliveryError` TEXT NULL,
    `lastDeliveryAttemptAt` DATETIME(3) NULL,
    `requestOrigin` VARCHAR(191) NULL,
    `requestPath` VARCHAR(191) NULL,
    `referer` VARCHAR(191) NULL,
    `userAgent` VARCHAR(500) NULL,
    `ipHash` VARCHAR(128) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DiagnosticSubmission_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `DiagnosticSubmission_emailNormalized_createdAt_idx`(`emailNormalized`, `createdAt`),
    INDEX `DiagnosticSubmission_company_createdAt_idx`(`company`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdvisoryBooking` (
    `id` CHAR(36) NOT NULL,
    `requestId` VARCHAR(120) NOT NULL,
    `slotKey` VARCHAR(120) NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW') NOT NULL DEFAULT 'CONFIRMED',
    `fullName` VARCHAR(90) NOT NULL,
    `company` VARCHAR(120) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailNormalized` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(25) NOT NULL,
    `city` VARCHAR(80) NOT NULL,
    `processGoal` TEXT NOT NULL,
    `modality` VARCHAR(60) NOT NULL,
    `timezone` VARCHAR(80) NOT NULL,
    `scheduledDate` VARCHAR(10) NOT NULL,
    `scheduledTime` VARCHAR(5) NOT NULL,
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NOT NULL,
    `durationMinutes` INTEGER NOT NULL,
    `privacyAcceptedAt` DATETIME(3) NOT NULL,
    `privacyPolicyVersion` VARCHAR(120) NOT NULL,
    `calendarEventId` VARCHAR(191) NULL,
    `calendarId` VARCHAR(191) NULL,
    `meetingUrl` TEXT NULL,
    `googleCalendarEventId` VARCHAR(191) NULL,
    `googleCalendarHtmlLink` TEXT NULL,
    `googleMeetUrl` TEXT NULL,
    `calendarEventStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `calendarSyncStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `calendarSyncedAt` DATETIME(3) NULL,
    `calendarSyncError` TEXT NULL,
    `internalEmailStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `clientEmailStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `companyEmailStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `customerEmailStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `customerConfirmationEmailStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `companyConfirmationEmailStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `customerCancellationEmailStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `companyCancellationEmailStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `lastDeliveryError` TEXT NULL,
    `lastDeliveryAttemptAt` DATETIME(3) NULL,
    `cancelledAt` DATETIME(3) NULL,
    `cancellationReason` TEXT NULL,
    `requestOrigin` VARCHAR(191) NULL,
    `requestPath` VARCHAR(191) NULL,
    `referer` VARCHAR(191) NULL,
    `userAgent` VARCHAR(500) NULL,
    `ipHash` VARCHAR(128) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdvisoryBooking_requestId_key`(`requestId`),
    UNIQUE INDEX `AdvisoryBooking_slotKey_key`(`slotKey`),
    UNIQUE INDEX `AdvisoryBooking_calendarEventId_key`(`calendarEventId`),
    UNIQUE INDEX `AdvisoryBooking_googleCalendarEventId_key`(`googleCalendarEventId`),
    INDEX `AdvisoryBooking_status_startAt_idx`(`status`, `startAt`),
    INDEX `AdvisoryBooking_emailNormalized_createdAt_idx`(`emailNormalized`, `createdAt`),
    INDEX `AdvisoryBooking_scheduledDate_status_idx`(`scheduledDate`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AvailabilitySettings` (
    `id` CHAR(36) NOT NULL,
    `isEnabled` BOOLEAN NOT NULL DEFAULT true,
    `timezone` VARCHAR(80) NOT NULL DEFAULT 'America/Bogota',
    `timezoneLabel` VARCHAR(80) NOT NULL DEFAULT 'America/Bogota',
    `durationMinutes` INTEGER NOT NULL DEFAULT 45,
    `bufferMinutes` INTEGER NOT NULL DEFAULT 15,
    `minNoticeHours` INTEGER NOT NULL DEFAULT 12,
    `maxDaysAhead` INTEGER NOT NULL DEFAULT 30,
    `defaultModality` VARCHAR(80) NOT NULL DEFAULT 'Virtual',
    `calendarMockMode` VARCHAR(40) NOT NULL DEFAULT 'none',
    `updatedByAdminId` CHAR(36) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AvailabilitySettings_isEnabled_updatedAt_idx`(`isEnabled`, `updatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AvailabilityRule` (
    `id` CHAR(36) NOT NULL,
    `settingsId` CHAR(36) NOT NULL,
    `weekday` INTEGER NOT NULL,
    `startTime` VARCHAR(5) NOT NULL,
    `endTime` VARCHAR(5) NOT NULL,
    `isEnabled` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AvailabilityRule_settingsId_weekday_isEnabled_idx`(`settingsId`, `weekday`, `isEnabled`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AvailabilityException` (
    `id` CHAR(36) NOT NULL,
    `settingsId` CHAR(36) NOT NULL,
    `date` VARCHAR(10) NOT NULL,
    `type` ENUM('BLOCKED_DAY', 'SPECIAL_HOURS') NOT NULL,
    `reason` VARCHAR(180) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AvailabilityException_settingsId_date_type_idx`(`settingsId`, `date`, `type`),
    UNIQUE INDEX `AvailabilityException_settingsId_date_key`(`settingsId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AvailabilityExceptionRange` (
    `id` CHAR(36) NOT NULL,
    `exceptionId` CHAR(36) NOT NULL,
    `startTime` VARCHAR(5) NOT NULL,
    `endTime` VARCHAR(5) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AvailabilityExceptionRange_exceptionId_sortOrder_idx`(`exceptionId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlockedPeriod` (
    `id` CHAR(36) NOT NULL,
    `settingsId` CHAR(36) NOT NULL,
    `date` VARCHAR(10) NOT NULL,
    `startTime` VARCHAR(5) NOT NULL,
    `endTime` VARCHAR(5) NOT NULL,
    `reason` VARCHAR(180) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `BlockedPeriod_settingsId_date_idx`(`settingsId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CalendarIntegration` (
    `id` CHAR(36) NOT NULL,
    `provider` VARCHAR(80) NOT NULL DEFAULT 'google_calendar',
    `mode` VARCHAR(40) NOT NULL DEFAULT 'mock',
    `calendarId` VARCHAR(191) NULL,
    `isEnabled` BOOLEAN NOT NULL DEFAULT false,
    `syncStatus` ENUM('PENDING', 'SENT', 'FAILED', 'SKIPPED') NOT NULL DEFAULT 'SKIPPED',
    `lastSyncError` TEXT NULL,
    `lastCheckedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CalendarIntegration_provider_mode_isEnabled_idx`(`provider`, `mode`, `isEnabled`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminNote` (
    `id` CHAR(36) NOT NULL,
    `adminUserId` CHAR(36) NOT NULL,
    `contactSubmissionId` CHAR(36) NULL,
    `diagnosticSubmissionId` CHAR(36) NULL,
    `advisoryBookingId` CHAR(36) NULL,
    `body` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AdminNote_adminUserId_createdAt_idx`(`adminUserId`, `createdAt`),
    INDEX `AdminNote_contactSubmissionId_createdAt_idx`(`contactSubmissionId`, `createdAt`),
    INDEX `AdminNote_diagnosticSubmissionId_createdAt_idx`(`diagnosticSubmissionId`, `createdAt`),
    INDEX `AdminNote_advisoryBookingId_createdAt_idx`(`advisoryBookingId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StatusHistory` (
    `id` CHAR(36) NOT NULL,
    `adminUserId` CHAR(36) NULL,
    `contactSubmissionId` CHAR(36) NULL,
    `diagnosticSubmissionId` CHAR(36) NULL,
    `advisoryBookingId` CHAR(36) NULL,
    `fromStatus` VARCHAR(40) NULL,
    `toStatus` VARCHAR(40) NOT NULL,
    `note` TEXT NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `StatusHistory_adminUserId_createdAt_idx`(`adminUserId`, `createdAt`),
    INDEX `StatusHistory_contactSubmissionId_createdAt_idx`(`contactSubmissionId`, `createdAt`),
    INDEX `StatusHistory_diagnosticSubmissionId_createdAt_idx`(`diagnosticSubmissionId`, `createdAt`),
    INDEX `StatusHistory_advisoryBookingId_createdAt_idx`(`advisoryBookingId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AdminSession` ADD CONSTRAINT `AdminSession_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `AdminUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminRolePermission` ADD CONSTRAINT `AdminRolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `AdminPermission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminLoginAttempt` ADD CONSTRAINT `AdminLoginAttempt_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminAuditLog` ADD CONSTRAINT `AdminAuditLog_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminNotification` ADD CONSTRAINT `AdminNotification_recipientAdminUserId_fkey` FOREIGN KEY (`recipientAdminUserId`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvailabilitySettings` ADD CONSTRAINT `AvailabilitySettings_updatedByAdminId_fkey` FOREIGN KEY (`updatedByAdminId`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvailabilityRule` ADD CONSTRAINT `AvailabilityRule_settingsId_fkey` FOREIGN KEY (`settingsId`) REFERENCES `AvailabilitySettings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvailabilityException` ADD CONSTRAINT `AvailabilityException_settingsId_fkey` FOREIGN KEY (`settingsId`) REFERENCES `AvailabilitySettings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvailabilityExceptionRange` ADD CONSTRAINT `AvailabilityExceptionRange_exceptionId_fkey` FOREIGN KEY (`exceptionId`) REFERENCES `AvailabilityException`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlockedPeriod` ADD CONSTRAINT `BlockedPeriod_settingsId_fkey` FOREIGN KEY (`settingsId`) REFERENCES `AvailabilitySettings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminNote` ADD CONSTRAINT `AdminNote_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `AdminUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminNote` ADD CONSTRAINT `AdminNote_contactSubmissionId_fkey` FOREIGN KEY (`contactSubmissionId`) REFERENCES `ContactSubmission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminNote` ADD CONSTRAINT `AdminNote_diagnosticSubmissionId_fkey` FOREIGN KEY (`diagnosticSubmissionId`) REFERENCES `DiagnosticSubmission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminNote` ADD CONSTRAINT `AdminNote_advisoryBookingId_fkey` FOREIGN KEY (`advisoryBookingId`) REFERENCES `AdvisoryBooking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StatusHistory` ADD CONSTRAINT `StatusHistory_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StatusHistory` ADD CONSTRAINT `StatusHistory_contactSubmissionId_fkey` FOREIGN KEY (`contactSubmissionId`) REFERENCES `ContactSubmission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StatusHistory` ADD CONSTRAINT `StatusHistory_diagnosticSubmissionId_fkey` FOREIGN KEY (`diagnosticSubmissionId`) REFERENCES `DiagnosticSubmission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StatusHistory` ADD CONSTRAINT `StatusHistory_advisoryBookingId_fkey` FOREIGN KEY (`advisoryBookingId`) REFERENCES `AdvisoryBooking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
