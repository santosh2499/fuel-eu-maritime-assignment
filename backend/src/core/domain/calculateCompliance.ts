// src/core/domain/calculateCompliance.ts

/**
 * Compute Compliance Balance (CB) for a ship/route
 * CB = (Target - Actual) * EnergyInScope
 */

export const TARGET_INTENSITY = 89.3368; // gCO2e/MJ
export const MJ_PER_TON_FUEL = 41000; // MJ/t

export interface RouteData {
  fuelConsumption: number; // in tons
  ghgIntensity: number;    // in gCO2e/MJ
}

/**
 * Compute energy in scope (MJ)
 * @param fuelTons fuel consumption in tons
 * @returns energy in MJ
 */
export function energyInScope(fuelTons: number): number {
  return fuelTons * MJ_PER_TON_FUEL;
}

/**
 * Compute Compliance Balance (CB)
 * Positive CB => surplus, Negative CB => deficit
 * @param route RouteData
 * @returns CB in gCO2eq
 */
export function computeCB(route: RouteData): number {
  const energy = energyInScope(route.fuelConsumption);
  const cb = (TARGET_INTENSITY - route.ghgIntensity) * energy;
  return cb;
}
