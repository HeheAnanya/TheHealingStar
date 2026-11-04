-- AlterTable
ALTER TABLE `Product` MODIFY `description` LONGTEXT NOT NULL;

-- CreateTable
CREATE TABLE `AvailabilitySlot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startsAt` DATETIME(3) NOT NULL,
    `endsAt` DATETIME(3) NOT NULL,
    `timezone` VARCHAR(191) NOT NULL DEFAULT 'Asia/Kolkata',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AvailabilitySlot_startsAt_isActive_idx`(`startsAt`, `isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `orderItemId` INTEGER NOT NULL,
    `slotId` INTEGER NOT NULL,
    `serviceName` VARCHAR(191) NOT NULL,
    `status` ENUM('BOOKED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'BOOKED',
    `bookedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Appointment_orderItemId_key`(`orderItemId`),
    UNIQUE INDEX `Appointment_slotId_key`(`slotId`),
    INDEX `Appointment_userId_status_idx`(`userId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_slotId_fkey` FOREIGN KEY (`slotId`) REFERENCES `AvailabilitySlot`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
