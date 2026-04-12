const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes    = require("./src/routes/auth");
const profileRoutes = require("./src/routes/profile");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ service: "user-service", status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

app.use("/", authRoutes);
app.use("/profile", profileRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vaultex_users";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`✅ User Service running on port ${PORT}`));
  })
  .catch((err) => { console.error("❌ MongoDB failed:", err.message); process.exit(1); });
