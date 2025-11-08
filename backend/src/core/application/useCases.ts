import { Company, Ship } from "../domain/entities";
import { calculateCompliance, transferCredits, createPool } from "../domain/services";

export class CompanyService {
  private companies: Company[] = [];

  registerCompany(name: string): Company {
    const newCompany: Company = {
      id: `comp-${Date.now()}`,
      name,
      ships: [],
      fuelCredits: 100,
    };
    this.companies.push(newCompany);
    return newCompany;
  }

  getAllCompanies(): Company[] {
    return this.companies;
  }

  addShip(companyId: string, ship: Ship): Ship | null {
    const company = this.companies.find(c => c.id === companyId);
    if (!company) return null;
    ship.complianceScore = calculateCompliance(ship);
    company.ships.push(ship);
    return ship;
  }

  transferFuelCredits(fromId: string, toId: string, amount: number): boolean {
    const from = this.companies.find(c => c.id === fromId);
    const to = this.companies.find(c => c.id === toId);
    if (!from || !to) return false;
    return transferCredits(from, to, amount);
  }

  createFuelPool(name: string, memberIds: string[]) {
    const members = this.companies.filter(c => memberIds.includes(c.id));
    return createPool(name, members);
  }
}

export const companyService = new CompanyService();
