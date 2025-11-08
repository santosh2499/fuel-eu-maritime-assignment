// src/adapters/inbound/http/complianceController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { computeCB } from '../../../core/domain/calculateCompliance';

const prisma = new PrismaClient();

/**
 * GET /compliance/cb?shipId&year
 * Compute and store CB snapshot
 */
export async function getComplianceCB(req: Request, res: Response) {
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: 'shipId and year required' });

  // Find routes for this ship (simplified: shipId = routeId)
  const route = await prisma.route.findUnique({
    where: { routeId: shipId as string },
  });

  if (!route) return res.status(404).json({ error: 'Route not found' });

  const cbValue = computeCB({ fuelConsumption: route.fuelConsumption, ghgIntensity: route.ghgIntensity });

  // Store CB snapshot
  const cbSnapshot = await prisma.shipCompliance.upsert({
    where: { shipId_year: { shipId: shipId as string, year: Number(year) } },
    update: { cb_gco2eq: cbValue },
    create: { shipId: shipId as string, year: Number(year), cb_gco2eq: cbValue },
  });

  res.json(cbSnapshot);
}

/**
 * GET /compliance/adjusted-cb?shipId&year
 * Return CB after applying banked surplus (if any)
 */
export async function getAdjustedCB(req: Request, res: Response) {
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: 'shipId and year required' });

  const cbRecord = await prisma.shipCompliance.findUnique({
    where: { shipId_year: { shipId: shipId as string, year: Number(year) } },
  });

  if (!cbRecord) return res.status(404).json({ error: 'CB record not found' });

  // Sum of banked surplus for this ship and year
  const banked = await prisma.bankEntry.aggregate({
    where: { shipId: shipId as string, year: Number(year) },
    _sum: { amount_gco2eq: true },
  });

  const adjustedCB = cbRecord.cb_gco2eq + (banked._sum.amount_gco2eq || 0);

  res.json({
    shipId,
    year: Number(year),
    cb_before: cbRecord.cb_gco2eq,
    banked: banked._sum.amount_gco2eq || 0,
    cb_after: adjustedCB,
  });
}
