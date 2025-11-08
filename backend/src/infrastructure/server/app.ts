import express from "express";
import routesRouter from "../../adapters/inbound/http/routes";
import complianceRouter from "../../adapters/inbound/http/compliance";
import bankingRouter from "../../adapters/inbound/http/banking";
import poolsRouter from "../../adapters/inbound/http/pools";

const app = express();
app.use(express.json());

// Add routes endpoints
app.use("/routes", routesRouter);

// Add compliance endpoints
app.use("/compliance", complianceRouter);

app.use("/banking", bankingRouter);

// Existing app.use calls...
app.use("/pools", poolsRouter);

export default app;
