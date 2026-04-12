const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── POST /register ─────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, storeName, storeDescription, phone } = req.body;

    if (!name || !email || !password || !storeName) {
      return res.status(400).json({ error: "Name, email, password and store name are required." });
    }

    const existing = await Seller.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "A seller account with this email already exists." });
    }

    const seller = await Seller.create({
      name,
      email,
      password,
      storeName,
      storeDescription: storeDescription || "",
      phone: phone || "",
    });

    const token = generateToken(seller._id);

    res.status(201).json({
      message: "Seller account created. Pending approval.",
      token,
      seller: {
        id:               seller._id,
        name:             seller.name,
        email:            seller.email,
        storeName:        seller.storeName,
        storeDescription: seller.storeDescription,
        status:           seller.status,
        createdAt:        seller.createdAt,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    console.error("Seller register error:", err);
    res.status(500).json({ error: "Server error during registration." });
  }
};

// ── POST /login ────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const seller = await Seller.findOne({ email }).select("+password");
    if (!seller) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await seller.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = generateToken(seller._id);

    res.status(200).json({
      message: "Login successful.",
      token,
      seller: {
        id:        seller._id,
        name:      seller.name,
        email:     seller.email,
        storeName: seller.storeName,
        status:    seller.status,
      },
    });
  } catch (err) {
    console.error("Seller login error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
};

module.exports = { register, login };
