const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes      = require("./src/routes/auth");
const dashboardRoutes = require("./src/routes/dashboard");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ service: "seller-service", status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

app.use("/", authRoutes);
app.use("/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vaultex_sellers";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`✅ Seller Service running on port ${PORT}`));
  })
  .catch((err) => { console.error("❌ MongoDB failed:", err.message); process.exit(1); });
