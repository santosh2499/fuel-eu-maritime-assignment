import { Router } from "express";
import { z } from "zod";
import {
  registerCompanySchema,
  addShipSchema,
  transferSchema,
  poolSchema,
} from "../../../core/domain/validationSchemas";
import { companyServicePrisma as companyService } from "../../../core/application/companyServicePrisma";

const router = Router();

// POST /company
router.post("/", async (req, res, next) => {
  try {
    const data = registerCompanySchema.parse(req.body);
    const company = await companyService.registerCompany(data.name);
    res.status(201).json(company);
  } catch (err) {
    next(err);
  }
});

// POST /company/:id/ships
router.post("/:id/ships", async (req, res, next) => {
  try {
    const data = addShipSchema.parse(req.body);
    const ship = await companyService.addShip(req.params.id, data);
    res.status(201).json(ship);
  } catch (err) {
    next(err);
  }
});

// POST /transfer
router.post("/transfer", async (req, res, next) => {
  try {
    const data = transferSchema.parse(req.body);
    const success = await companyService.transferFuelCredits(
      data.fromId, data.toId, data.amount
    );
    res.json({ success });
  } catch (err) {
    next(err);
  }
});

// POST /pools
router.post("/pools", async (req, res, next) => {
  try {
    const data = poolSchema.parse(req.body);
    const pool = await companyService.createFuelPool(data.name, data.memberIds);
    res.status(201).json(pool);
  } catch (err) {
    next(err);
  }
});

export default router;
