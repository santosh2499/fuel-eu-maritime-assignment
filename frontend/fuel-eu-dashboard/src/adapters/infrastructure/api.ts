// src/adapters/infrastructure/api.ts
import axios from 'axios';

// --------------------- Routes ---------------------
export const getRoutes = async () => {
  return axios.get('/routes');
};

export const setBaseline = async (routeId: string) => {
  return axios.post(`/routes/${routeId}/baseline`);
};

// --------------------- Compare ---------------------
export const getComparison = async () => {
  return axios.get('/routes/comparison');
};

// --------------------- Banking ---------------------
export const getCB = async (shipId?: string, year?: number) => {
  return axios.get('/compliance/cb', { params: { shipId, year } });
};

export const bankCB = async (shipId: string, year: number, amount: number) => {
  return axios.post('/banking/bank', { shipId, year, amount });
};

export const applyBankedCB = async (shipId: string, year: number, amount: number) => {
  return axios.post('/banking/apply', { shipId, year, amount });
};

// --------------------- Pooling ---------------------
export const getAdjustedCB = async (year: number) => {
  return axios.get('/compliance/adjusted-cb', { params: { year } });
};

export const createPool = async (members: any[]) => {
  return axios.post('/pools', { members });
};
