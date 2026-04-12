const Seller = require("../models/Seller");

// ── GET /dashboard ─────────────────────────────────────────────
const getDashboard = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id);

    res.status(200).json({
      dashboard: {
        id:               seller._id,
        name:             seller.name,
        email:            seller.email,
        storeName:        seller.storeName,
        storeDescription: seller.storeDescription,
        phone:            seller.phone,
        address:          seller.address,
        status:           seller.status,
        totalSales:       seller.totalSales,
        totalProducts:    seller.totalProducts,
        rating:           seller.rating,
        memberSince:      seller.createdAt,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Error fetching dashboard." });
  }
};

// ── PUT /dashboard ─────────────────────────────────────────────
const updateDashboard = async (req, res) => {
  try {
    const { storeName, storeDescription, phone, address } = req.body;

    const updates = {};
    if (storeName)        updates.storeName        = storeName.trim();
    if (storeDescription) updates.storeDescription = storeDescription.trim();
    if (phone)            updates.phone            = phone;
    if (address)          updates.address          = address;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update." });
    }

    const seller = await Seller.findByIdAndUpdate(
      req.seller._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Store updated successfully.",
      seller: {
        id:               seller._id,
        storeName:        seller.storeName,
        storeDescription: seller.storeDescription,
        phone:            seller.phone,
        address:          seller.address,
      },
    });
  } catch (err) {
    console.error("Update dashboard error:", err);
    res.status(500).json({ error: "Error updating store." });
  }
};

// ── GET /dashboard/stats ───────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id);

    res.status(200).json({
      stats: {
        totalSales:    seller.totalSales,
        totalProducts: seller.totalProducts,
        rating:        seller.rating,
        status:        seller.status,
      },
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Error fetching stats." });
  }
};

module.exports = { getDashboard, updateDashboard, getStats };
