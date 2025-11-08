import prisma from "../../infrastructure/db/prisma";
import { calculateCompliance } from "../domain/services";

export class CompanyServicePrisma {
  async registerCompany(name: string) {
    return await prisma.company.create({
      data: { name },
    });
  }

  async getAllCompanies() {
    return await prisma.company.findMany({
      include: { ships: true },
    });
  }

  async addShip(companyId: string, data: { name: string; fuelType: string; emissionRate: number; }) {
    const complianceScore = calculateCompliance({
      id: "",
      name: data.name,
      fuelType: data.fuelType as any,
      emissionRate: data.emissionRate,
      complianceScore: 0,
    });

    return await prisma.ship.create({
      data: {
        ...data,
        complianceScore,
        companyId,
      },
    });
  }

  async transferFuelCredits(fromId: string, toId: string, amount: number) {
    const from = await prisma.company.findUnique({ where: { id: fromId } });
    const to = await prisma.company.findUnique({ where: { id: toId } });
    if (!from || !to || from.fuelCredits < amount) return false;

    await prisma.$transaction([
      prisma.company.update({ where: { id: fromId }, data: { fuelCredits: { decrement: amount } } }),
      prisma.company.update({ where: { id: toId }, data: { fuelCredits: { increment: amount } } }),
    ]);
    return true;
  }

  async createFuelPool(name: string, memberIds: string[]) {
    const companies = await prisma.company.findMany({ where: { id: { in: memberIds } } });
    const totalCredits = companies.reduce((sum, c) => sum + c.fuelCredits, 0);

    const pool = await prisma.pool.create({
      data: {
        name,
        totalCredits,
        members: {
          create: companies.map(c => ({ companyId: c.id })),
        },
      },
      include: { members: true },
    });

    return pool;
  }
}

export const companyServicePrisma = new CompanyServicePrisma();
