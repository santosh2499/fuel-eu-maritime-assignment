import { Route } from '../../core/domain/Route';

const routes: Route[] = [
  { id: 1, routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500, isBaseline: false },
  { id: 2, routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200, isBaseline: false },
  { id: 3, routeId: 'R003', vesselType: 'Tanker', fuelType: 'MGO', year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distance: 12500, totalEmissions: 4700, isBaseline: false },
  { id: 4, routeId: 'R004', vesselType: 'RoRo', fuelType: 'HFO', year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distance: 11800, totalEmissions: 4300, isBaseline: false },
  { id: 5, routeId: 'R005', vesselType: 'Container', fuelType: 'LNG', year: 2025, ghgIntensity: 90.5, fuelConsumption: 4950, distance: 11900, totalEmissions: 4400, isBaseline: false },
];

export const getAllRoutesService = async () => {
  return routes;
};

export const setBaselineService = async (routeId: string) => {
  routes.forEach(r => r.isBaseline = r.routeId === routeId);
  return { message: `Baseline set for ${routeId}` };
};

export const getComparisonService = async () => {
  const baseline = routes.find(r => r.isBaseline);
  if (!baseline) throw new Error('No baseline set');

  const comparisons = routes.map(r => ({
    routeId: r.routeId,
    baseline: baseline.ghgIntensity,
    comparison: r.ghgIntensity,
    percentDiff: ((r.ghgIntensity / baseline.ghgIntensity - 1) * 100),
    compliant: ((r.ghgIntensity / baseline.ghgIntensity - 1) * 100) <= 2,
  }));
  return comparisons;
};
