import { computeCB, energyInScope } from '../calculateCompliance';

describe('calculateCompliance', () => {
  it('computes energy in scope correctly', () => {
    expect(energyInScope(1000)).toBe(1000 * 41000);
  });

  it('computes CB correctly', () => {
    const cb = computeCB({ fuelConsumption: 5000, ghgIntensity: 91 });
    const expected = (89.3368 - 91) * (5000 * 41000);
    expect(cb).toBeCloseTo(expected, 2);
  });
});
