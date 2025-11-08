import { Route } from '../domain/route';

const TARGET_INTENSITY_2025 = 89.3368; // gCO2e/MJ

export function computeCB(route: Route): number {
  const energyMJ = route.fuelConsumption * 41000; // t * 41,000 MJ/t
  return (TARGET_INTENSITY_2025 - route.ghgIntensity) * energyMJ;
}

export function computeComparison(baseline: Route, comparison: Route) {
  const percentDiff = ((comparison.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
  const compliant = comparison.ghgIntensity <= TARGET_INTENSITY_2025;
  return { routeId: comparison.routeId, baseline: baseline.ghgIntensity, comparison: comparison.ghgIntensity, percentDiff, compliant };
}
