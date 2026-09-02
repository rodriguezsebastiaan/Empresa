-- CreateTable
CREATE TABLE `EmailDelivery` (
    `id` CHAR(36) NOT NULL,
    `type` ENUM('DIAGNOSTIC_RECEIVED_CUSTOMER', 'DIAGNOSTIC_RECEIVED_ADMIN', 'BOOKING_CONFIRMED_CUSTOMER', 'BOOKING_CONFIRMED_ADMIN', 'DIAGNOSTIC_STATUS_CHANGED', 'BOOKING_RESCHEDULED', 'BOOKING_CANCELLED', 'BOOKING_ONE_HOUR_REMINDER') NOT NULL,
    `entityType` VARCHAR(80) NOT NULL,
    `entityId` VARCHAR(120) NOT NULL,
    `recipient` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `provider` ENUM('MOCK', 'RESEND') NOT NULL DEFAULT 'MOCK',
    `providerMessageId` VARCHAR(191) NULL,
    `idempotencyKey` VARCHAR(191) NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `maxAttempts` INTEGER NOT NULL DEFAULT 3,
    `lastError` TEXT NULL,
    `scheduledFor` DATETIME(3) NULL,
    `processingStartedAt` DATETIME(3) NULL,
    `sentAt` DATETIME(3) NULL,
    `failedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmailDelivery_idempotencyKey_key`(`idempotencyKey`),
    INDEX `EmailDelivery_status_scheduledFor_idx`(`status`, `scheduledFor`),
    INDEX `EmailDelivery_entityType_entityId_idx`(`entityType`, `entityId`),
    INDEX `EmailDelivery_type_status_idx`(`type`, `status`),
    INDEX `EmailDelivery_provider_status_idx`(`provider`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
