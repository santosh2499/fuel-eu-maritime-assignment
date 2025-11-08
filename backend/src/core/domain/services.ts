import { Ship, Company, Pool } from "./entities";

// --- Fuel Compliance Calculation ---
export function calculateCompliance(ship: Ship): number {
  const base = ship.emissionRate <= 50 ? 100 : 100 - (ship.emissionRate - 50) * 0.5;
  return Math.max(0, Math.min(base, 100));
}

// --- Pooling ---
export function createPool(name: string, members: Company[]): Pool {
  const totalCredits = members.reduce((sum, c) => sum + c.fuelCredits, 0);
  return { id: `pool-${Date.now()}`, name, members, totalCredits };
}

// --- Banking ---
export function transferCredits(from: Company, to: Company, amount: number): boolean {
  if (from.fuelCredits < amount) return false;
  from.fuelCredits -= amount;
  to.fuelCredits += amount;
  return true;
}
