import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// ---------------------------
// POST /pools
// Body: { year, members: [{ shipId }] }
// ---------------------------
router.post("/", async (req: Request, res: Response) => {
  const { year, members } = req.body;

  if (!year || !members || !Array.isArray(members)) {
    return res.status(400).json({ error: "year and members array required" });
  }

  try {
    // Fetch adjusted CB for all members
    const cbRecords = await Promise.all(
      members.map(async (m: { shipId: string }) => {
        const compliance = await prisma.shipCompliance.findFirst({
          where: { shipId: m.shipId, year: parseInt(String(year)) },
        });
        if (!compliance) throw new Error(`Compliance record not found for ship ${m.shipId}`);
        return { shipId: m.shipId, cb_before: compliance.cb_gco2eq, cb_after: compliance.cb_gco2eq };
      })
    );

    // Validate pool sum
    const totalCB = cbRecords.reduce((sum, r) => sum + r.cb_after, 0);
    if (totalCB < 0) return res.status(400).json({ error: "Pool CB sum cannot be negative" });

    // Greedy allocation: sort descending by CB
    const sorted = [...cbRecords].sort((a, b) => b.cb_after - a.cb_after);

    // Redistribute surplus to deficits
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].cb_after <= 0) continue;
      for (let j = sorted.length - 1; j > i; j--) {
        if (sorted[j].cb_after >= 0) continue;
        const transfer = Math.min(sorted[i].cb_after, -sorted[j].cb_after);
        sorted[i].cb_after -= transfer;
        sorted[j].cb_after += transfer;
      }
    }

    // Persist pool record
    const pool = await prisma.pool.create({ data: { year: parseInt(String(year)) } });

    // Persist pool members
    await Promise.all(
      sorted.map(async (r) => {
        await prisma.poolMember.create({
          data: {
            poolId: pool.id,
            shipId: r.shipId,
            cb_before: r.cb_before,
            cb_after: r.cb_after,
          },
        });
      })
    );

    res.json({ poolId: pool.id, members: sorted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create pool", details: err.message });
  }
});

export default router;
