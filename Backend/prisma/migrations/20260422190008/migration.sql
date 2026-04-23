/*
  Warnings:

  - The values [COD,PHONEPAY] on the enum `Payment_payMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Payment` MODIFY `payMethod` ENUM('CARD', 'UPI', 'NETBANKING', 'WALLET', 'EMI', 'PAYLATER') NOT NULL;
