export type FuelType = "Renewable" | "Fossil" | "Hybrid";

export interface Ship {
  id: string;
  name: string;
  fuelType: FuelType;
  emissionRate: number; // gCO2 per nautical mile
  complianceScore: number; // 0 - 100
}

export interface Company {
  id: string;
  name: string;
  ships: Ship[];
  fuelCredits: number; // Banking system credits
}

export interface Pool {
  id: string;
  name: string;
  members: Company[];
  totalCredits: number;
}
