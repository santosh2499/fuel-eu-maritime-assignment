import request from "supertest";
import express from "express";
import companyRoutes from "../companyRoutes";
import { errorHandler } from "../../../../shared/errorHandler";

const app = express();
app.use(express.json());
app.use("/api/companies", companyRoutes);
app.use(errorHandler);

describe("Company Routes", () => {
  it("should reject invalid company name", async () => {
    const res = await request(app).post("/api/companies").send({ name: "A" });
    expect(res.status).toBe(400);
  });
});
