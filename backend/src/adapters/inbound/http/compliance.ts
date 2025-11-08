import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { computeCB } from "../../../core/domain/compliance";

const prisma = new PrismaClient();
const router = express.Router();

// ---------------------------
// GET /compliance/cb?shipId&year
// Compute & store CB
// ---------------------------
router.get("/cb", async (req: Request, res: Response) => {
  const { shipId, year } = req.query;

  if (!shipId || !year) return res.status(400).json({ error: "shipId and year are required" });

  try {
    // Fetch all routes for this ship
    const routes = await prisma.route.findMany({
      where: { shipId: String(shipId) },
    });

    if (!routes.length) return res.status(404).json({ error: "No routes found for ship" });

    // Sum CB across all routes
    const cbTotal = routes.reduce((sum, r) => sum + computeCB(r.ghgIntensity, r.fuelConsumed), 0);

    // Store snapshot
    const compliance = await prisma.shipCompliance.create({
      data: {
        shipId: String(shipId),
        year: parseInt(String(year)),
        cb_gco2eq: cbTotal,
        cb_before: cbTotal,
      },
    });

    res.json({
      shipId: compliance.shipId,
      year: compliance.year,
      cb_gco2eq: compliance.cb_gco2eq,
      cb_before: compliance.cb_before,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute CB" });
  }
});

// ---------------------------
// GET /compliance/adjusted-cb?shipId&year
// Fetch CB after banking adjustments
// ---------------------------
router.get("/adjusted-cb", async (req: Request, res: Response) => {
  const { shipId, year } = req.query;

  if (!shipId || !year) return res.status(400).json({ error: "shipId and year are required" });

  try {
    const compliance = await prisma.shipCompliance.findFirst({
      where: { shipId: String(shipId), year: parseInt(String(year)) },
    });

    if (!compliance) return res.status(404).json({ error: "Compliance record not found" });

    // Calculate adjusted CB using applied bank entries
    const bankEntries = await prisma.bankEntry.findMany({
      where: { shipId: String(shipId), year: parseInt(String(year)) },
    });

    const appliedTotal = bankEntries.reduce((sum, b) => sum + b.applied, 0);

    res.json({
      shipId: compliance.shipId,
      year: compliance.year,
      cb_before: compliance.cb_before,
      cb_after: compliance.cb_before + appliedTotal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch adjusted CB" });
  }
});

export default router;
