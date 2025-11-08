import { PrismaClient } from '@prisma/client';
import { Route } from '../../../core/domain/route';
import { computeCB } from '../../../core/application/computeCB';

const prisma = new PrismaClient();

// Fetch CB for all ships for a given year
export async function getCB(year: number) {
  const routes = await prisma.routes.findMany({ where: { year } });

  const cbRecords = await Promise.all(
    routes.map(async (r) => {
      const cbValue = computeCB({
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
      });

      // Store CB snapshot
      await prisma.ship_compliance.upsert({
        where: { ship_id_year: { ship_id: r.route_id, year } },
        update: { cb_gco2eq: cbValue },
        create: { ship_id: r.route_id, year, cb_gco2eq: cbValue },
      });

      return { shipId: r.route_id, cb: cbValue };
    })
  );

  return cbRecords;
}

// Fetch adjusted CB after applying banked amounts (simplified for now)
export async function getAdjustedCB(year: number) {
  // For demo, just return CB as-is
  const cb = await getCB(year);
  return cb.map(r => ({ shipId: r.shipId, cb_gco2eq: r.cb }));
}
