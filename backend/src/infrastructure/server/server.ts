// src/infrastructure/server/server.ts
import express from 'express';
import routesRouter from '../../adapters/inbound/http';

const app = express();
app.use(express.json());

app.use('/api', routesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
