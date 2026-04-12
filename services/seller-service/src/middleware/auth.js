const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authorised. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const seller = await Seller.findById(decoded.id);
    if (!seller) {
      return res.status(401).json({ error: "Seller no longer exists." });
    }

    if (seller.status === "suspended") {
      return res.status(403).json({ error: "Your seller account has been suspended." });
    }

    req.seller = seller;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError")  return res.status(401).json({ error: "Invalid token." });
    if (err.name === "TokenExpiredError")  return res.status(401).json({ error: "Token expired. Please log in again." });
    res.status(500).json({ error: "Auth middleware error." });
  }
};

module.exports = { protect };
