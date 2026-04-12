const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const cartRoutes = require("./src/routes/cartRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ service: "cart-service", status: "ok" });
});

app.use("/", cartRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`✅ Cart Service running on port ${PORT}`));
