const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const { connectRabbitMQ } = require("./src/rabbitmq");
const paymentRoutes        = require("./src/routes/paymentRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ service: "payment-service", status: "ok" });
});

// Nginx strips /api/payments/ — service receives routes directly
app.use("/", paymentRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

const PORT = process.env.PORT || 3004;

// Connect to RabbitMQ then start server
connectRabbitMQ().then(() => {
  app.listen(PORT, () => console.log(`✅ Payment Service running on port ${PORT}`));
}).catch(() => {
  // Start anyway even if RabbitMQ isn't ready yet
  app.listen(PORT, () => console.log(`✅ Payment Service running on port ${PORT} (RabbitMQ pending)`));
});
