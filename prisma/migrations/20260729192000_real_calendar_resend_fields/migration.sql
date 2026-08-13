ALTER TABLE "AdvisoryBooking"
ADD COLUMN "calendarEventId" VARCHAR(191),
ADD COLUMN "calendarId" VARCHAR(191),
ADD COLUMN "meetingUrl" TEXT,
ADD COLUMN "calendarSyncedAt" TIMESTAMP(3),
ADD COLUMN "customerConfirmationEmailStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "companyConfirmationEmailStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "customerCancellationEmailStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "companyCancellationEmailStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING';

UPDATE "AdvisoryBooking"
SET
  "calendarEventId" = "googleCalendarEventId",
  "meetingUrl" = "googleMeetUrl",
  "customerConfirmationEmailStatus" = "customerEmailStatus",
  "companyConfirmationEmailStatus" = "companyEmailStatus";

CREATE UNIQUE INDEX "AdvisoryBooking_calendarEventId_key" ON "AdvisoryBooking"("calendarEventId");
