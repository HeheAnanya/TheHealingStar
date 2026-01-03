/*
  Warnings:

  - The values [NUMERLOGY] on the enum `Product_productCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `productCategory` ENUM('NUMEROLOGY', 'TAROT', 'REIKI_HEALING', 'CRYSTAL') NOT NULL;
