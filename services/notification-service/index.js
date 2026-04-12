const express = require("express");
const app = express();
app.use(express.json());
app.get("/health", (req, res) => res.json({ service: "notification-service", status: "ok" }));
app.get("/", (req, res) => res.json({ message: "🔔 Vaultex Notification Service is running" }));
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`✅ Notification Service running on port ${PORT}`));
