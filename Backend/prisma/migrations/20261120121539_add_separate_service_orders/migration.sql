/*
  Warnings:

  - A unique constraint covering the columns `[serviceOrderId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[calendlyEventUri]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[calendlyInviteeUri]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_orderItemId_fkey`;

-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_slotId_fkey`;

-- AlterTable
ALTER TABLE `Appointment` ADD COLUMN `calendlyEventUri` VARCHAR(500) NULL,
    ADD COLUMN `calendlyInviteeUri` VARCHAR(500) NULL,
    ADD COLUMN `cancelUrl` VARCHAR(1000) NULL,
    ADD COLUMN `durationMinutes` INTEGER NULL,
    ADD COLUMN `rescheduleUrl` VARCHAR(1000) NULL,
    ADD COLUMN `scheduledAt` DATETIME(3) NULL,
    ADD COLUMN `serviceOrderId` INTEGER NULL,
    MODIFY `orderItemId` INTEGER NULL,
    MODIFY `slotId` INTEGER NULL;

-- CreateTable
CREATE TABLE `ServicePackage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` ENUM('TAROT', 'REIKI', 'NUMEROLOGY') NOT NULL,
    `description` TEXT NULL,
    `price` INTEGER NOT NULL,
    `durationMinutes` INTEGER NOT NULL,
    `calendlyEventTypeUri` VARCHAR(500) NULL,
    `schedulingUrl` VARCHAR(1000) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `packageId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `payStatus` ENUM('FAILED', 'SUCCESS') NOT NULL DEFAULT 'FAILED',
    `razorpayOrderId` VARCHAR(191) NULL,
    `razorpayPaymentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ServiceOrder_razorpayOrderId_key`(`razorpayOrderId`),
    UNIQUE INDEX `ServiceOrder_razorpayPaymentId_key`(`razorpayPaymentId`),
    INDEX `ServiceOrder_userId_createdAt_idx`(`userId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Appointment_serviceOrderId_key` ON `Appointment`(`serviceOrderId`);

-- CreateIndex
CREATE UNIQUE INDEX `Appointment_calendlyEventUri_key` ON `Appointment`(`calendlyEventUri`);

-- CreateIndex
CREATE UNIQUE INDEX `Appointment_calendlyInviteeUri_key` ON `Appointment`(`calendlyInviteeUri`);

-- CreateIndex
CREATE INDEX `Appointment_scheduledAt_idx` ON `Appointment`(`scheduledAt`);

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_slotId_fkey` FOREIGN KEY (`slotId`) REFERENCES `AvailabilitySlot`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_serviceOrderId_fkey` FOREIGN KEY (`serviceOrderId`) REFERENCES `ServiceOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrder` ADD CONSTRAINT `ServiceOrder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrder` ADD CONSTRAINT `ServiceOrder_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `ServicePackage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
