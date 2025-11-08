import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /banking/records?year=YYYY
router.get('/records', async (req, res) => {
  const year = parseInt(req.query.year as string);
  const records = await prisma.bank_entries.findMany({ where: { year } });
  res.json(records);
});

// POST /banking/bank
router.post('/bank', async (req, res) => {
  const { shipId, year, amount_gco2eq } = req.body;
  if (!shipId || !year || !amount_gco2eq) return res.status(400).json({ error: 'Missing fields' });

  const entry = await prisma.bank_entries.create({ data: { ship_id: shipId, year, amount_gco2eq } });
  res.json(entry);
});

// POST /banking/apply
router.post('/apply', async (req, res) => {
  const { shipId, year, amount_gco2eq } = req.body;
  const record = await prisma.bank_entries.findFirst({ where: { ship_id: shipId, year } });
  if (!record) return res.status(400).json({ error: 'No banked CB available' });

  if (amount_gco2eq > record.amount_gco2eq) return res.status(400).json({ error: 'Cannot apply more than banked' });

  // Reduce banked amount
  await prisma.bank_entries.update({
    where: { id: record.id },
    data: { amount_gco2eq: record.amount_gco2eq - amount_gco2eq },
  });

  // Update ship_compliance CB
  const compliance = await prisma.ship_compliance.findFirst({ where: { ship_id: shipId, year } });
  await prisma.ship_compliance.update({
    where: { id: compliance!.id },
    data: { cb_gco2eq: compliance!.cb_gco2eq + amount_gco2eq },
  });

  res.json({ applied: amount_gco2eq, cb_after: compliance!.cb_gco2eq + amount_gco2eq });
});

export default router;
