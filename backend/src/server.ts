import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ✅ Root route (for Postman test)
app.get('/', (req, res) => {
  res.status(200).json({ message: '🚀 FuelEU Maritime Backend Running Successfully!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
