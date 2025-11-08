-- DropForeignKey
ALTER TABLE "PoolMember" DROP CONSTRAINT "PoolMember_poolId_fkey";

-- AlterTable
ALTER TABLE "PoolMember" ALTER COLUMN "poolId" DROP NOT NULL,
ALTER COLUMN "shipId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Route" ALTER COLUMN "distanceKm" DROP DEFAULT,
ALTER COLUMN "fuelType" DROP DEFAULT,
ALTER COLUMN "ghgIntensity" DROP DEFAULT,
ALTER COLUMN "fuelConsumption" DROP DEFAULT,
ALTER COLUMN "totalEmissions" DROP DEFAULT,
ALTER COLUMN "vesselType" DROP DEFAULT,
ALTER COLUMN "year" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ship" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ship_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ship" ADD CONSTRAINT "Ship_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoolMember" ADD CONSTRAINT "PoolMember_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoolMember" ADD CONSTRAINT "PoolMember_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship"("id") ON DELETE SET NULL ON UPDATE CASCADE;
