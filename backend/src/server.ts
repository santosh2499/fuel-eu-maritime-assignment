import express from "express";
import routesRouter from "./adapters/inbound/http/routesController";

const app = express();
app.use(express.json());

// Mount routes
app.use("/routes", routesRouter);

export default app;
