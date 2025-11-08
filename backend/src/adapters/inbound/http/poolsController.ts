import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /pools
router.post('/', async (req, res) => {
  const { year, members } = req.body; // members = [{ shipId, cb_before }]
  if (!year || !members) return res.status(400).json({ error: 'Missing year or members' });

  // Sort by CB descending (surplus first)
  const sorted = members.sort((a: any, b: any) => b.cb_before - a.cb_before);

  let poolSum = sorted.reduce((sum: number, m: any) => sum + m.cb_before, 0);
  if (poolSum < 0) return res.status(400).json({ error: 'Total CB < 0, cannot pool' });

  // Simple greedy allocation
  const results = sorted.map((m: any) => ({ ...m, cb_after: m.cb_before }));

  // Save pool
  const pool = await prisma.pools.create({ data: { year } });
  for (const r of results) {
    await prisma.pool_members.create({
      data: { pool_id: pool.id, ship_id: r.shipId, cb_before: r.cb_before, cb_after: r.cb_after },
    });
  }

  res.json({ poolId: pool.id, poolSum, members: results });
});

export default router;
