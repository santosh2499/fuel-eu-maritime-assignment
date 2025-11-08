import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { computePercentDiff, isCompliant } from "../../../core/domain/compliance";

const prisma = new PrismaClient();
const router = express.Router();

// ---------------------------
// GET /routes
// ---------------------------
router.get("/", async (req: Request, res: Response) => {
  const { vesselType, fuelType, year } = req.query;

  try {
    const routes = await prisma.route.findMany({
      where: {
        fuelType: fuelType ? String(fuelType) : undefined,
        // year filter if needed (assuming year stored elsewhere)
      },
      orderBy: { routeCode: "asc" },
    });
    res.json(routes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
});

// ---------------------------
// POST /routes/:routeId/baseline
// ---------------------------
router.post("/:routeId/baseline", async (req: Request, res: Response) => {
  const { routeId } = req.params;

  try {
    // Reset previous baseline
    await prisma.route.updateMany({ where: { baseline: true }, data: { baseline: false } });

    // Set new baseline
    const updated = await prisma.route.update({
      where: { routeCode: routeId },
      data: { baseline: true },
    });

    res.json({ message: `${updated.routeCode} set as baseline` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to set baseline" });
  }
});

// ---------------------------
// GET /routes/comparison
// ---------------------------
router.get("/comparison", async (req: Request, res: Response) => {
  try {
    // Find baseline route
    const baseline = await prisma.route.findFirst({ where: { baseline: true } });
    if (!baseline) return res.status(404).json({ error: "No baseline found" });

    // Fetch all other routes
    const comparisonRoutes = await prisma.route.findMany({
      where: { baseline: false },
      orderBy: { routeCode: "asc" },
    });

    // Compute comparison metrics
    const comparisons = comparisonRoutes.map((r) => ({
      routeId: r.routeCode,
      baselineId: baseline.routeCode,
      baselineGhg: baseline.ghgIntensity,
      comparisonGhg: r.ghgIntensity,
      percentDiff: parseFloat(computePercentDiff(baseline.ghgIntensity, r.ghgIntensity).toFixed(4)),
      compliant: isCompliant(r.ghgIntensity),
    }));

    res.json(comparisons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute comparisons" });
  }
});

export default router;
