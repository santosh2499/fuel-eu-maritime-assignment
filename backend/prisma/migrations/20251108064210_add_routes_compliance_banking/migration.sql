/*
  Warnings:

  - You are about to drop the column `fuelCredits` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `complianceScore` on the `Ship` table. All the data in the column will be lost.
  - You are about to drop the column `emissionRate` on the `Ship` table. All the data in the column will be lost.
  - You are about to drop the column `fuelType` on the `Ship` table. All the data in the column will be lost.
  - You are about to drop the `Pool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PoolMember` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[imoNumber]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imoNumber` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PoolMember" DROP CONSTRAINT "PoolMember_companyId_fkey";

-- DropForeignKey
ALTER TABLE "PoolMember" DROP CONSTRAINT "PoolMember_poolId_fkey";

-- DropForeignKey
ALTER TABLE "Ship" DROP CONSTRAINT "Ship_companyId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "fuelCredits",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imoNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ship" DROP COLUMN "complianceScore",
DROP COLUMN "emissionRate",
DROP COLUMN "fuelType",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "companyId" DROP NOT NULL;

-- DropTable
DROP TABLE "Pool";

-- DropTable
DROP TABLE "PoolMember";

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "routeCode" TEXT NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "fuelType" TEXT NOT NULL,
    "ghgIntensity" DOUBLE PRECISION NOT NULL,
    "fuelConsumed" DOUBLE PRECISION NOT NULL,
    "baseline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shipId" TEXT,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipCompliance" (
    "id" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "cb_gco2eq" DOUBLE PRECISION NOT NULL,
    "cb_before" DOUBLE PRECISION,
    "cb_after" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipCompliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankEntry" (
    "id" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "applied" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_routeCode_key" ON "Route"("routeCode");

-- CreateIndex
CREATE UNIQUE INDEX "Company_imoNumber_key" ON "Company"("imoNumber");

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipCompliance" ADD CONSTRAINT "ShipCompliance_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankEntry" ADD CONSTRAINT "BankEntry_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
