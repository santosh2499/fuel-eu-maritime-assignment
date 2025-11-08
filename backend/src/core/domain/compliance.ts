// ---------------------------
// Fuel EU Maritime Compliance Logic
// ---------------------------

export const TARGET_INTENSITY = 89.3368; // gCO2e/MJ

/**
 * Compute total energy in scope (MJ)
 * Energy = fuelConsumed (t) * 41,000 MJ/t
 */
export function computeEnergy(fuelConsumedT: number): number {
  return fuelConsumedT * 41000;
}

/**
 * Compute Compliance Balance (CB)
 * CB = (Target - Actual) * Energy
 * Positive → Surplus, Negative → Deficit
 */
export function computeCB(ghgIntensity: number, fuelConsumedT: number): number {
  const energy = computeEnergy(fuelConsumedT);
  return (TARGET_INTENSITY - ghgIntensity) * energy;
}

/**
 * Compute % difference for comparison vs baseline
 * percentDiff = ((comparison / baseline) - 1) * 100
 */
export function computePercentDiff(baselineGhg: number, comparisonGhg: number): number {
  return ((comparisonGhg / baselineGhg) - 1) * 100;
}

/**
 * Determine compliance based on target intensity
 */
export function isCompliant(ghgIntensity: number): boolean {
  return ghgIntensity <= TARGET_INTENSITY;
}
