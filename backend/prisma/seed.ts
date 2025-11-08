import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // --- Clear old data first (safe reset) ---
  await prisma.route.deleteMany();

  // --- Seed routes ---
  await prisma.route.createMany({
    data: [
      {
        routeCode: "R001",
        fuelType: "HFO",
        distanceKm: 12000,
        ghgIntensity: 91.0,
        fuelConsumed: 5000,
        baseline: true,
      },
      {
        routeCode: "R002",
        fuelType: "LNG",
        distanceKm: 11500,
        ghgIntensity: 88.0,
        fuelConsumed: 4800,
      },
      {
        routeCode: "R003",
        fuelType: "MGO",
        distanceKm: 12500,
        ghgIntensity: 93.5,
        fuelConsumed: 5100,
      },
      {
        routeCode: "R004",
        fuelType: "HFO",
        distanceKm: 11800,
        ghgIntensity: 89.2,
        fuelConsumed: 4900,
      },
      {
        routeCode: "R005",
        fuelType: "LNG",
        distanceKm: 11900,
        ghgIntensity: 90.5,
        fuelConsumed: 4950,
      },
    ],
  });

  console.log("✅ Routes seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
