import express from "express";
import cors from "cors";
import companyRoutes from "../../adapters/inbound/http/companyRoutes";
import { errorHandler } from "../../shared/errorHandler";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/companies", companyRoutes);
app.use(errorHandler); // must be last

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
