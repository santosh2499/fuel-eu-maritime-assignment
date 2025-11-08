import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// ---------------------------
// GET /banking/records?shipId&year
// ---------------------------
router.get("/records", async (req: Request, res: Response) => {
  const { shipId, year } = req.query;
  if (!shipId || !year) return res.status(400).json({ error: "shipId and year required" });

  try {
    const records = await prisma.bankEntry.findMany({
      where: { shipId: String(shipId), year: parseInt(String(year)) },
      orderBy: { createdAt: "asc" },
    });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bank records" });
  }
});

// ---------------------------
// POST /banking/bank
// Bank positive CB
// Body: { shipId, year, amount }
// ---------------------------
router.post("/bank", async (req: Request, res: Response) => {
  const { shipId, year, amount } = req.body;
  if (!shipId || !year || amount === undefined) return res.status(400).json({ error: "shipId, year, and amount required" });

  if (amount <= 0) return res.status(400).json({ error: "Amount must be positive" });

  try {
    const bankEntry = await prisma.bankEntry.create({
      data: {
        shipId: String(shipId),
        year: parseInt(String(year)),
        amount: parseFloat(amount),
      },
    });

    res.json({ message: "Banked successfully", bankEntry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to bank CB" });
  }
});

// ---------------------------
// POST /banking/apply
// Apply banked CB to deficit
// Body: { shipId, year, applyAmount }
// ---------------------------
router.post("/apply", async (req: Request, res: Response) => {
  const { shipId, year, applyAmount } = req.body;
  if (!shipId || !year || applyAmount === undefined) return res.status(400).json({ error: "shipId, year, applyAmount required" });

  try {
    // Fetch total available banked CB
    const banked = await prisma.bankEntry.findMany({
      where: { shipId: String(shipId), year: parseInt(String(year)) },
    });

    const available = banked.reduce((sum, b) => sum + (b.amount - b.applied), 0);
    if (applyAmount > available) return res.status(400).json({ error: "Apply amount exceeds available banked CB" });

    // Apply greedily
    let remaining = applyAmount;
    for (const b of banked) {
      const canApply = Math.min(remaining, b.amount - b.applied);
      if (canApply > 0) {
        await prisma.bankEntry.update({
          where: { id: b.id },
          data: { applied: b.applied + canApply },
        });
        remaining -= canApply;
      }
      if (remaining <= 0) break;
    }

    res.json({ message: "Applied banked CB successfully", applied: applyAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to apply banked CB" });
  }
});

export default router;
