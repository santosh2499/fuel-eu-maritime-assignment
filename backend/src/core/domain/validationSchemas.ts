import { z } from "zod";

export const registerCompanySchema = z.object({
  name: z.string().min(3, "Company name must be at least 3 characters long"),
});

export const addShipSchema = z.object({
  name: z.string().min(2),
  fuelType: z.enum(["HFO", "LNG", "MGO", "Renewable"]),
  emissionRate: z.number().positive(),
});

export const transferSchema = z.object({
  fromId: z.string().uuid("Invalid source company ID"),
  toId: z.string().uuid("Invalid target company ID"),
  amount: z.number().positive("Transfer amount must be > 0"),
});

export const poolSchema = z.object({
  name: z.string().min(3),
  memberIds: z.array(z.string().uuid()).min(2, "Pool requires at least 2 members"),
});
