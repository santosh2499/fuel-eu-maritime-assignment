// src/adapters/inbound/http/index.ts
import express from 'express';
import {
  getRoutes,
  setBaseline,
  getRoutesComparison,
} from './routesController';
import {
  getComplianceCB,
  getAdjustedCB,
} from './complianceController';
import {
  getBankingRecords,
  bankCB,
  applyBankedCB,
} from './bankingController';
import { createPool } from './poolsController';

const router = express.Router();

// Routes endpoints
router.get('/routes', getRoutes);
router.post('/routes/:routeId/baseline', setBaseline);
router.get('/routes/comparison', getRoutesComparison);

// Compliance endpoints
router.get('/compliance/cb', getComplianceCB);
router.get('/compliance/adjusted-cb', getAdjustedCB);

// Banking endpoints
router.get('/banking/records', getBankingRecords);
router.post('/banking/bank', bankCB);
router.post('/banking/apply', applyBankedCB);

// Pools endpoint
router.post('/pools', createPool);

export default router;
