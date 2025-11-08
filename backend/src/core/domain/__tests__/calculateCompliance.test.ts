// export type FuelType = "HFO" | "MDO" | "LNG";
// export interface Ship {
//   id: string;
//   name: string;
//   fuelType: FuelType;
//   emissionRate: number;
//   complianceScore: number;
// }


import { computeCB, computeEnergy, computePercentDiff, isCompliant, TARGET_INTENSITY } from "../compliance";

describe("FuelEU Compliance Logic", () => {

  test("computeEnergy returns correct MJ", () => {
    expect(computeEnergy(1000)).toBe(41000000);
  });

  test("computeCB calculates correct compliance balance", () => {
    // Positive CB = Surplus
    const cb = computeCB(88, 5000);
    expect(cb).toBeCloseTo((TARGET_INTENSITY - 88) * 5000 * 41000);
  });

  test("computePercentDiff calculates correct % difference", () => {
    const percent = computePercentDiff(90, 88);
    expect(percent).toBeCloseTo(((88 / 90) - 1) * 100);
  });

  test("isCompliant returns true for <= target", () => {
    expect(isCompliant(89.0)).toBe(true);
    expect(isCompliant(89.3368)).toBe(true);
  });

  test("isCompliant returns false for > target", () => {
    expect(isCompliant(90)).toBe(false);
  });

});
