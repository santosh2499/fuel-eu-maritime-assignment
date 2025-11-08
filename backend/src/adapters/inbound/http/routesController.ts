import { Request, Response } from 'express';
import { getAllRoutesService, setBaselineService, getComparisonService } from '../../application/routesService';

export const getAllRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await getAllRoutesService();
    res.json(routes);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

export const setBaseline = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await setBaselineService(id);
    res.json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};

export const getComparison = async (req: Request, res: Response) => {
  try {
    const result = await getComparisonService();
    res.json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
};
