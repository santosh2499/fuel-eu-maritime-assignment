// src/infrastructure/server/app.ts
import express, { Request, Response, NextFunction } from 'express';
import { getAllRoutes, setBaseline, getComparison } from '../../adapters/inbound/http/routesController';

const app = express();
app.use(express.json());

// Routes
app.get('/routes', getAllRoutes);
app.post('/routes/:id/baseline', setBaseline);
app.get('/routes/comparison', getComparison);

// Global error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err instanceof Error) {
    res.status(500).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default app;
