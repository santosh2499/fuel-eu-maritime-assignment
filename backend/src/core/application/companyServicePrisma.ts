// src/core/application/companyServicePrisma.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CompanyService {
  /**
   * Create a new company
   */
  async createCompany(name: string, imoNumber: string) {
    return await prisma.company.create({
      data: {
        name,
        imoNumber, // required now
      },
    });
  }

  /**
   * Create a new ship for a company
   */
  async createShip(companyId: string, shipName: string) {
    return await prisma.ship.create({
      data: {
        name: shipName,
        companyId,
        // Removed complianceScore
      },
    });
  }

  /**
   * Get company with ships
   */
  async getCompany(companyId: string) {
    return await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        ships: true, // relations included
      },
    });
  }

  /**
   * Update company name
   */
  async updateCompanyName(companyId: string, name: string) {
    return await prisma.company.update({
      where: { id: companyId },
      data: { name }, // Removed fuelCredits
    });
  }

  /**
   * Create a pool for a given year
   */
  async createPool(year: number) {
    return await prisma.pool.create({
      data: { year },
    });
  }

  /**
   * Get all pools
   */
  async getAllPools() {
    return await prisma.pool.findMany({
      include: { poolMembers: true }, // include members
    });
  }

  /**
   * Add ship to a pool
   */
  async addShipToPool(poolId: string, shipId: string, cbBefore: number, cbAfter: number) {
    return await prisma.poolMember.create({
      data: {
        poolId,
        shipId,
        cbBefore,
        cbAfter,
      },
    });
  }
}

export const companyService = new CompanyService();
