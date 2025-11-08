import { PrismaClient } from '@prisma/client';
import { Route } from '../../../core/domain/route';

const prisma = new PrismaClient();

export async function getAllRoutes(): Promise<Route[]> {
  const rows = await prisma.routes.findMany();
  return rows.map(r => ({
    id: r.id,
    routeId: r.route_id,
    vesselType: r.vessel_type,
    fuelType: r.fuel_type,
    year: r.year,
    ghgIntensity: r.ghg_intensity,
    fuelConsumption: r.fuel_consumption,
    distance: r.distance,
    totalEmissions: r.total_emissions,
    isBaseline: r.is_baseline,
  }));
}

export async function setBaseline(routeId: string) {
  // unset existing baseline for the year
  const route = await prisma.routes.findUnique({ where: { route_id: routeId } });
  if (!route) throw new Error('Route not found');

  await prisma.routes.updateMany({
    where: { year: route.year },
    data: { is_baseline: false },
  });

  return prisma.routes.update({
    where: { route_id: routeId },
    data: { is_baseline: true },
  });
}
