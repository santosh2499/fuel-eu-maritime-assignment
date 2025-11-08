/*
  Warnings:

  - You are about to drop the column `amount` on the `BankEntry` table. All the data in the column will be lost.
  - You are about to drop the column `applied` on the `BankEntry` table. All the data in the column will be lost.
  - You are about to drop the column `baseline` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `fuelConsumed` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `routeCode` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `shipId` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `cb_after` on the `ShipCompliance` table. All the data in the column will be lost.
  - You are about to drop the column `cb_before` on the `ShipCompliance` table. All the data in the column will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ship` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[routeId]` on the table `Route` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount_gco2eq` to the `BankEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `BankEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `routeId` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BankEntry" DROP CONSTRAINT "BankEntry_shipId_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_shipId_fkey";

-- DropForeignKey
ALTER TABLE "Ship" DROP CONSTRAINT "Ship_companyId_fkey";

-- DropForeignKey
ALTER TABLE "ShipCompliance" DROP CONSTRAINT "ShipCompliance_shipId_fkey";

-- DropIndex
DROP INDEX "Route_routeCode_key";

-- AlterTable
ALTER TABLE "BankEntry" DROP COLUMN "amount",
DROP COLUMN "applied",
ADD COLUMN     "amount_gco2eq" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "baseline",
DROP COLUMN "createdAt",
DROP COLUMN "fuelConsumed",
DROP COLUMN "routeCode",
DROP COLUMN "shipId",
ADD COLUMN     "fuelConsumption" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "isBaseline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "routeId" TEXT NOT NULL,
ADD COLUMN     "totalEmissions" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "vesselType" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "year" INTEGER NOT NULL DEFAULT 2024,
ALTER COLUMN "distanceKm" SET DEFAULT 0,
ALTER COLUMN "fuelType" SET DEFAULT 'Unknown',
ALTER COLUMN "ghgIntensity" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "ShipCompliance" DROP COLUMN "cb_after",
DROP COLUMN "cb_before";

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "Ship";

-- CreateTable
CREATE TABLE "Pool" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoolMember" (
    "id" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "shipId" TEXT NOT NULL,
    "cbBefore" DOUBLE PRECISION NOT NULL,
    "cbAfter" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PoolMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_routeId_key" ON "Route"("routeId");

-- AddForeignKey
ALTER TABLE "PoolMember" ADD CONSTRAINT "PoolMember_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
