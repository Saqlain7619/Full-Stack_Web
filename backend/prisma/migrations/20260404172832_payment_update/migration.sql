/*
  Warnings:

  - The `paymentMethod` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentStatus` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('COD', 'JAZZCASH', 'EASYPAISA', 'PAYFAST');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentData" JSONB,
ADD COLUMN     "paymentGateway" TEXT,
ADD COLUMN     "transactionId" TEXT,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'COD',
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING';
